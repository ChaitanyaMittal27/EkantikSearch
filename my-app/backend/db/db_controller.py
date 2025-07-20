# backend/db/db_controller.py

from .supabase_client import get_connection

class TableEntry:
    def __init__(self, question_text, video_url, timestamp, video_date, video_index, video_question_index):
        self.question_text = question_text
        self.video_url = video_url
        self.timestamp = timestamp
        self.video_date = video_date
        self.video_index = video_index
        self.video_question_index = video_question_index

def insert_into_db(entry):
    """Insert a single TableEntry into Supabase (PostgreSQL)."""
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO questions (
            question_text, video_url, timestamp, video_date, video_index, video_question_index
        ) VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        entry.question_text,
        entry.video_url,
        entry.timestamp,
        entry.video_date,
        entry.video_index,
        entry.video_question_index
    ))

    conn.commit()
    cursor.close()
    conn.close()

def search_questions(query):
    """Search questions from Supabase (PostgreSQL)."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT question_text, video_url, timestamp, video_date
        FROM questions
        WHERE question_text ILIKE %s
        ORDER BY video_index DESC
    """, (f"%{query}%",))

    results = [{"question": row[0], "video_url": row[1], "timestamp": row[2], "video_date": row[3]}
               for row in cursor.fetchall()]
    
    cursor.close()
    conn.close()
    return results
