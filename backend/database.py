import sqlite3
import os
from datetime import datetime

# Database file path
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "ai_tools.db")

def get_db_connection():
    """Establishes a connection to the SQLite database."""
    # Ensure data directory exists
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create tools table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tools (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            url TEXT,
            repo_url TEXT UNIQUE,
            category TEXT,
            pricing TEXT DEFAULT 'Unknown',
            stars INTEGER DEFAULT 0,
            forks INTEGER DEFAULT 0,
            downloads INTEGER DEFAULT 0,
            license TEXT,
            created_at TIMESTAMP,
            last_updated TIMESTAMP,
            score REAL DEFAULT 0.0
        )
    ''')

    # Create daily_stats table for trending analysis
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS daily_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tool_id INTEGER,
            date DATE,
            stars INTEGER,
            downloads INTEGER,
            FOREIGN KEY (tool_id) REFERENCES tools (id),
            UNIQUE(tool_id, date)
        )
    ''')

    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_FILE}")

def upsert_tool(tool_data):
    """Inserts or updates a tool."""
    conn = get_db_connection()
    cursor = conn.cursor()

    now = datetime.now()

    try:
        # Check if exists
        cursor.execute("SELECT id FROM tools WHERE repo_url = ?", (tool_data['repo_url'],))
        existing = cursor.fetchone()

        if existing:
            tool_id = existing['id']
            cursor.execute('''
                UPDATE tools SET
                    name = ?, description = ?, url = ?, category = ?, pricing = ?,
                    stars = ?, forks = ?, downloads = ?, license = ?, last_updated = ?, score = ?
                WHERE id = ?
            ''', (
                tool_data['name'], tool_data['description'], tool_data['url'], tool_data['category'],
                tool_data['pricing'], tool_data['stars'], tool_data['forks'], tool_data['downloads'],
                tool_data['license'], tool_data.get('last_updated', now), tool_data['score'], tool_id
            ))
        else:
            cursor.execute('''
                INSERT INTO tools (
                    name, description, url, repo_url, category, pricing,
                    stars, forks, downloads, license, created_at, last_updated, score
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                tool_data['name'], tool_data['description'], tool_data['url'], tool_data['repo_url'],
                tool_data['category'], tool_data['pricing'], tool_data['stars'], tool_data['forks'],
                tool_data['downloads'], tool_data['license'], tool_data.get('created_at', now), tool_data.get('last_updated', now), tool_data['score']
            ))
            tool_id = cursor.lastrowid

        # Add daily stats
        today = datetime.now().date()
        cursor.execute('''
            INSERT OR REPLACE INTO daily_stats (tool_id, date, stars, downloads)
            VALUES (?, ?, ?, ?)
        ''', (tool_id, today, tool_data['stars'], tool_data['downloads']))

        conn.commit()
        return tool_id
    except Exception as e:
        print(f"Error upserting tool {tool_data.get('name')}: {e}")
        return None
    finally:
        conn.close()

def get_all_tools(category=None, sort_by='score', limit=100):
    """Retrieves tools with optional filtering and sorting."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM tools"
    params = []

    if category and category != 'All':
        query += " WHERE category = ?"
        params.append(category)

    if sort_by == 'stars':
        query += " ORDER BY stars DESC"
    elif sort_by == 'newest':
        query += " ORDER BY created_at DESC"
    elif sort_by == 'updated':
        query += " ORDER BY last_updated DESC"
    else: # default score
        query += " ORDER BY score DESC"

    query += " LIMIT ?"
    params.append(limit)

    cursor.execute(query, params)
    tools = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return tools

def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT category FROM tools WHERE category IS NOT NULL ORDER BY category")
    categories = [row['category'] for row in cursor.fetchall()]
    conn.close()
    return categories

if __name__ == "__main__":
    init_db()
