import chalk from 'chalk';
import Table from 'cli-table3';

type StatusCounts = {
  done: number;
  archived: number;
  pending: number;
  processing: number;
  failed: number;
  other: number;
  total: number;
};

type GapItem = {
  id: string;
  title: string;
  status: string;
  issue: string;
  created_at: string;
};

export function formatStatusOutput(counts: StatusCounts, json: boolean): string {
  if (json) {
    return JSON.stringify(counts, null, 2);
  }

  const table = new Table({
    head: [chalk.cyan('Status'), chalk.cyan('Count'), chalk.cyan('Percentage')],
    colWidths: [15, 10, 15],
  });

  const addRow = (label: string, count: number, color: (s: string) => string) => {
    const pct = counts.total > 0 ? ((count / counts.total) * 100).toFixed(1) : '0.0';
    table.push([color(label), count.toString(), `${pct}%`]);
  };

  addRow('Done', counts.done, chalk.green);
  addRow('Archived', counts.archived, chalk.gray);
  addRow('Processing', counts.processing, chalk.yellow);
  addRow('Pending', counts.pending, chalk.blue);
  addRow('Failed', counts.failed, chalk.red);
  if (counts.other > 0) {
    addRow('Other', counts.other, chalk.gray);
  }
  table.push([chalk.bold('Total'), chalk.bold(counts.total.toString()), '100%']);

  return table.toString();
}

export function formatGapsOutput(gaps: GapItem[], json: boolean): string {
  if (json) {
    return JSON.stringify(gaps, null, 2);
  }

  if (gaps.length === 0) {
    return chalk.green('✓ No gaps found! All content looks healthy.');
  }

  const table = new Table({
    head: [
      chalk.cyan('ID'),
      chalk.cyan('Title'),
      chalk.cyan('Status'),
      chalk.cyan('Issue'),
      chalk.cyan('Created'),
    ],
    colWidths: [10, 35, 12, 20, 12],
    wordWrap: true,
  });

  for (const item of gaps) {
    const date = new Date(item.created_at).toLocaleDateString();
    const truncatedTitle = item.title.length > 32 ? `${item.title.slice(0, 29)}...` : item.title;
    const truncatedId = item.id.slice(0, 8);

    table.push([
      truncatedId,
      truncatedTitle,
      item.status === 'done' ? chalk.green(item.status) : chalk.yellow(item.status),
      chalk.red(item.issue),
      date,
    ]);
  }

  return `${chalk.yellow(`Found ${gaps.length} item(s) with issues:`)}\n\n${table.toString()}`;
}

type HealthResult = {
  database: { connected: boolean; latencyMs?: number; error?: string };
  contentCount: number;
  audioCount: number;
};

export function formatHealthOutput(health: HealthResult, json: boolean): string {
  if (json) {
    return JSON.stringify(health, null, 2);
  }

  const lines: string[] = [];

  // Database connection
  if (health.database.connected) {
    lines.push(chalk.green(`✓ Database connected (${health.database.latencyMs}ms)`));
  } else {
    lines.push(chalk.red(`✗ Database connection failed: ${health.database.error}`));
  }

  // Content stats
  lines.push('');
  lines.push(chalk.cyan('Content Statistics:'));
  lines.push(`  Content items: ${health.contentCount}`);
  lines.push(`  Audio files: ${health.audioCount}`);

  return lines.join('\n');
}

export function formatError(message: string): string {
  return chalk.red(`Error: ${message}`);
}

export function formatSuccess(message: string): string {
  return chalk.green(`✓ ${message}`);
}
