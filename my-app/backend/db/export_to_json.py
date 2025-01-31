import sqlite3
import json
import os
import sys

# Default database path
DB_PATH = "db/ekankik_data.db"

def export_to_json(export_path):
    """
    Exports data from ekankik_data.db to a JSON file.

    - Reads all questions from the database.
    - Saves the output to the given `export_path`.
    - Always overwrites the file.

    Args:
        export_path (str): The path where the JSON file should be saved.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM questions")  # Adjust this query as needed
    rows = cursor.fetchall()

    # Database schema for reference
    # (0, 'id', 'INTEGER')
    # (1, 'question_text', 'TEXT')
    # (2, 'video_url', 'TEXT')
    # (3, 'timestamp', 'TEXT')
    # (4, 'video_date', 'TEXT')
    # (5, 'video_index', 'INTEGER')
    # (6, 'video_question_index', 'INTEGER')


    data = []
    for row in rows:
        data.append({
            "id": row[0],                     # Primary Key
            "question": row[1],                # `question_text`
            "video_url": row[2],               # `video_url`
            "timestamp": row[3],               # `timestamp`
            "video_date": row[4],              # `video_date`
            "video_index": row[5],             # `video_index`
            "video_question_index": row[6]     # `video_question_index`
        })


    # Ensure the output directory exists
    os.makedirs(os.path.dirname(export_path), exist_ok=True)

    # Always overwrite the file
    with open(export_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    conn.close()
    print(f"✅ Database exported successfully to {export_path}")

if __name__ == "__main__":
    # Ensure an export path is provided
    if len(sys.argv) < 2:
        print("❌ Usage: python export_to_json.py <export_path>")
        sys.exit(1)

    export_to_json(sys.argv[1])
