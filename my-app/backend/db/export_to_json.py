import sqlite3
import json
import os
import sys
import datetime

# Default database path
DB_PATH = "db/ekankik_data.db"

def export_to_json(export_path):
    """
    Exports data from ekankik_data.db to a JSON file.

    - Reads all questions from the database.
    - Saves the output to the given `export_path`.
    - If the file exists, archives it before overwriting.

    Args:
        export_path (str): The path where the JSON file should be saved.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM questions")  # Adjust this query as needed
    rows = cursor.fetchall()

    # Assuming the table has columns: id, video_index, timestamp, question, video_title, video_url
    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "video_index": row[1],
            "timestamp": row[2],
            "question": row[3],
            "video_title": row[4],
            "video_url": row[5]
        })

    # Ensure the output directory exists
    os.makedirs(os.path.dirname(export_path), exist_ok=True)

    # Archive previous file before overwriting
    if os.path.exists(export_path):
        archive_folder = "backend/db_archives"
        os.makedirs(archive_folder, exist_ok=True)

        timestamp = datetime.datetime.now().strftime("%Y%m%d")
        archive_path = os.path.join(archive_folder, f"all_{timestamp}.json")
        os.rename(export_path, archive_path)
        print(f"🗂️ Archived previous file as {archive_path}")

    # Write the new JSON file
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