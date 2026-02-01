"""Thread storage for ChatKit sessions using SQLite."""

import json
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any


class SQLiteStore:
    """Simple SQLite-based store for ChatKit threads and messages."""

    def __init__(self, db_path: str = "chatkit.db"):
        self.db_path = Path(db_path)
        self._init_db()

    def _init_db(self) -> None:
        """Initialize the database schema."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS threads (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                metadata TEXT DEFAULT '{}',
                created_at TEXT,
                updated_at TEXT
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                thread_id TEXT,
                role TEXT,
                content TEXT,
                metadata TEXT DEFAULT '{}',
                created_at TEXT,
                FOREIGN KEY (thread_id) REFERENCES threads(id)
            )
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id)
        """)

        conn.commit()
        conn.close()

    def generate_id(self) -> str:
        """Generate a unique ID."""
        return str(uuid.uuid4())

    def generate_item_id(self, item_type: str, thread: Any, context: Any) -> str:
        """Generate a unique ID for a message or widget item."""
        return f"{item_type}_{uuid.uuid4().hex[:12]}"

    def create_thread(self, user_id: str | None = None, metadata: dict | None = None) -> dict:
        """Create a new thread."""
        thread_id = self.generate_id()
        now = datetime.utcnow().isoformat()

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO threads (id, user_id, metadata, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (thread_id, user_id, json.dumps(metadata or {}), now, now),
        )

        conn.commit()
        conn.close()

        return {
            "id": thread_id,
            "user_id": user_id,
            "metadata": metadata or {},
            "created_at": now,
            "updated_at": now,
        }

    def get_thread(self, thread_id: str) -> dict | None:
        """Get a thread by ID."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM threads WHERE id = ?", (thread_id,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return None

        return {
            "id": row[0],
            "user_id": row[1],
            "metadata": json.loads(row[2]),
            "created_at": row[3],
            "updated_at": row[4],
        }

    def update_thread_metadata(self, thread_id: str, metadata: dict) -> None:
        """Update thread metadata."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Get existing metadata
        cursor.execute("SELECT metadata FROM threads WHERE id = ?", (thread_id,))
        row = cursor.fetchone()
        if row:
            existing = json.loads(row[0])
            existing.update(metadata)
            cursor.execute(
                """
                UPDATE threads SET metadata = ?, updated_at = ?
                WHERE id = ?
                """,
                (json.dumps(existing), datetime.utcnow().isoformat(), thread_id),
            )

        conn.commit()
        conn.close()

    def add_message(
        self,
        thread_id: str,
        role: str,
        content: str,
        metadata: dict | None = None,
    ) -> dict:
        """Add a message to a thread."""
        message_id = self.generate_id()
        now = datetime.utcnow().isoformat()

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO messages (id, thread_id, role, content, metadata, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (message_id, thread_id, role, content, json.dumps(metadata or {}), now),
        )

        # Update thread timestamp
        cursor.execute(
            "UPDATE threads SET updated_at = ? WHERE id = ?",
            (now, thread_id),
        )

        conn.commit()
        conn.close()

        return {
            "id": message_id,
            "thread_id": thread_id,
            "role": role,
            "content": content,
            "metadata": metadata or {},
            "created_at": now,
        }

    def get_messages(self, thread_id: str, limit: int = 50) -> list[dict]:
        """Get messages for a thread."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT * FROM messages WHERE thread_id = ?
            ORDER BY created_at DESC LIMIT ?
            """,
            (thread_id, limit),
        )

        rows = cursor.fetchall()
        conn.close()

        messages = []
        for row in reversed(rows):
            messages.append({
                "id": row[0],
                "thread_id": row[1],
                "role": row[2],
                "content": row[3],
                "metadata": json.loads(row[4]),
                "created_at": row[5],
            })

        return messages

    def delete_thread(self, thread_id: str) -> None:
        """Delete a thread and its messages."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("DELETE FROM messages WHERE thread_id = ?", (thread_id,))
        cursor.execute("DELETE FROM threads WHERE id = ?", (thread_id,))

        conn.commit()
        conn.close()
