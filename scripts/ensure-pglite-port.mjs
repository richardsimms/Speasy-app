import { execFileSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import net from 'node:net';
import { join } from 'node:path';

const HOST = '127.0.0.1';
const PORT = 5433;
const NEXT_DEV_LOCK = join(process.cwd(), '.next', 'dev', 'lock');

function isPortFree({ host, port }) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();

    server.once('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });

    server.listen(port, host, () => {
      server.close(() => resolve(true));
    });
  });
}

function tryExec(command, args) {
  try {
    return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function getListeningPids({ port }) {
  const out = tryExec('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t']);
  if (!out) {
    return [];
  }
  return out
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => Number.parseInt(s, 10))
    .filter(n => Number.isFinite(n));
}

function getPsCommand(pid) {
  return tryExec('ps', ['-p', String(pid), '-o', 'command=']);
}

function getParentPid(pid) {
  const out = tryExec('ps', ['-p', String(pid), '-o', 'ppid=']);
  if (!out) {
    return null;
  }
  const n = Number.parseInt(out.trim(), 10);
  return Number.isFinite(n) ? n : null;
}

function isRepoPgliteServerCommand(command) {
  if (!command) {
    return false;
  }
  return (
    command.includes('@electric-sql/pglite-socket')
    && command.includes('dist/scripts/server.js')
    && command.includes(`--port=${PORT}`)
  );
}

function isPnpmDbServerCommand(command) {
  if (!command) {
    return false;
  }
  return command.includes('pnpm') && command.includes('run') && command.includes('db-server:file');
}

function isNextDevCommand(command) {
  if (!command) {
    return false;
  }
  return (
    command.includes('next')
    && (command.includes('dist/bin/next dev') || command.includes('next dev') || command.includes('next-dev'))
  );
}

function getNextDevPids() {
  const out = tryExec('ps', ['aux']);
  if (!out) {
    return [];
  }
  const lines = out.split('\n');
  const pids = [];
  for (const line of lines) {
    if (isNextDevCommand(line)) {
      const match = line.match(/^\S+\s+(\d+)/);
      if (match) {
        const pid = Number.parseInt(match[1], 10);
        if (Number.isFinite(pid)) {
          pids.push(pid);
        }
      }
    }
  }
  return pids;
}

function cleanupNextDevLock() {
  if (existsSync(NEXT_DEV_LOCK)) {
    try {
      unlinkSync(NEXT_DEV_LOCK);

      console.log('[dev] Removed stale Next.js dev lock file');
    } catch {
      // ignore
    }
  }
}

async function cleanupStaleNextDev() {
  const pids = getNextDevPids();
  if (pids.length === 0) {
    cleanupNextDevLock();
    return;
  }

  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // ignore
    }
  }

  // Wait a bit for graceful shutdown
  const start = Date.now();

  while (true) {
    const remaining = getNextDevPids();
    if (remaining.length === 0) {
      break;
    }
    if (Date.now() - start > 2000) {
      // Force kill if still running after 2s
      for (const pid of remaining) {
        try {
          process.kill(pid, 'SIGKILL');
        } catch {
          // ignore
        }
      }
      break;
    }

    await new Promise(r => setTimeout(r, 100));
  }

  cleanupNextDevLock();
  if (pids.length > 0) {
    console.log(`[dev] Terminated ${pids.length} stale Next.js dev process(es)`);
  }
}

async function waitForPortFree({ host, port, timeoutMs }) {
  const start = Date.now();

  while (true) {
    const free = await isPortFree({ host, port });
    if (free) {
      return true;
    }
    if (Date.now() - start > timeoutMs) {
      return false;
    }

    await new Promise(r => setTimeout(r, 50));
  }
}

async function main() {
  // Clean up stale Next.js dev processes and lock files first
  await cleanupStaleNextDev();

  const free = await isPortFree({ host: HOST, port: PORT });
  if (free) {
    return;
  }

  const pids = getListeningPids({ port: PORT });
  if (pids.length === 0) {
    // Port is in use but we couldn't detect the PID (rare). Fail with instructions.

    console.error(`[dev] Port ${PORT} is already in use, but the owning PID could not be determined.`);

    console.error(`[dev] Try: lsof -nP -iTCP:${PORT} -sTCP:LISTEN`);
    process.exit(1);
  }

  const pglitePids = pids.filter(pid => isRepoPgliteServerCommand(getPsCommand(pid)));
  if (pglitePids.length === 0) {
    console.error(`[dev] Port ${PORT} is already in use by a non-PGlite process. Refusing to kill it.`);

    console.error(`[dev] Inspect with: lsof -nP -iTCP:${PORT} -sTCP:LISTEN`);
    process.exit(1);
  }

  for (const pid of pglitePids) {
    const parentPid = getParentPid(pid);
    const parentCommand = parentPid ? getPsCommand(parentPid) : null;

    const killTargetPid = parentPid && isPnpmDbServerCommand(parentCommand) ? parentPid : pid;

    try {
      process.kill(killTargetPid, 'SIGTERM');
    } catch {
      // ignore
    }

    const freed = await waitForPortFree({ host: HOST, port: PORT, timeoutMs: 1500 });
    if (freed) {
      continue;
    }

    try {
      process.kill(killTargetPid, 'SIGKILL');
    } catch {
      // ignore
    }
  }

  const finallyFree = await waitForPortFree({ host: HOST, port: PORT, timeoutMs: 1500 });
  if (!finallyFree) {
    console.error(`[dev] Port ${PORT} is still in use after attempting to stop stale PGlite servers.`);

    console.error(`[dev] Inspect with: lsof -nP -iTCP:${PORT} -sTCP:LISTEN`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[dev] Failed port preflight:', err);
  process.exit(1);
});
