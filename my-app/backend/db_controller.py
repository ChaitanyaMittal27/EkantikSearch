import sqlite3
import json

# 🔹 Database file
DB_FILE = "ekankik_data.db"

# 🔹 Class to temporarily hold extracted data before database insertion
class TableEntry:
    """Structure for holding extracted data before inserting into SQLite."""
    def __init__(self, question_text, video_url, timestamp, video_date, video_index, video_question_index):
        self.question_text = question_text  # Extracted question
        self.video_url = video_url  # Full YouTube link
        self.timestamp = timestamp  # Timestamp in HH:MM format
        self.video_date = video_date  # Upload date
        self.video_index = video_index  # Unique index of the video
        self.video_question_index = video_question_index  # Index of the question in the video

# 🔹 Function to create the SQLite database and questions table
def setup_database():
    """Creates the SQLite database and the 'questions' table if it does not exist."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_text TEXT,
            video_url TEXT,
            timestamp TEXT,
            video_date TEXT,
            video_index INTEGER,
            video_question_index INTEGER
        )
    ''')
    conn.commit()
    conn.close()

# 🔹 Function to insert a single entry into the database
def insert_into_db(entry):
    """Inserts a single TableEntry object into the database."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO questions (question_text, video_url, timestamp, video_date, video_index, video_question_index)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (entry.question_text, entry.video_url, entry.timestamp, entry.video_date, entry.video_index, entry.video_question_index))

    conn.commit()
    conn.close()

# 🔹 Function to search for questions containing a keyword
def search_questions(keyword):
    """Searches the database for questions containing a given keyword and exports results to search.json."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute('''
        SELECT question_text, video_url, timestamp, video_date
        FROM questions
        WHERE question_text LIKE ?
        ORDER BY video_index DESC
    ''', ('%' + keyword + '%',))

    results = [{"question": row[0], "video_url": row[1], "timestamp": row[2], "video_date": row[3]} for row in cursor.fetchall()]
    
    conn.close()

    # Save results to search.json
    with open("search.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)

    print(f"✅ Search results exported to search.json ({len(results)} matches found).")

# 🔹 Debug Function: Print all stored data in a readable format
def debug_print():
    """Prints all database entries in a readable format for debugging."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM questions ORDER BY video_index DESC")
    rows = cursor.fetchall()

    print("\n✅ Current Questions in Ekantik_DB:\n")
    
    if not rows:
        print("⚠️ No entries found in the database.")
    else:
        for row in rows:
            print(f"ID: {row[0]}")
            print(f"Question: {row[1]}")
            print(f"Video URL: {row[2]}")
            print(f"Timestamp: {row[3]}")
            print(f"Video Date: {row[4]}")
            print(f"Video Index: {row[5]}")
            print(f"Question Index: {row[6]}")
            print("-" * 50)  # Separator for readability
    
    conn.close()
