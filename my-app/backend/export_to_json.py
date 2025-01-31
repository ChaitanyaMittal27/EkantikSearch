import sqlite3
import json
import os

# Paths
DB_PATH = "../backend/ekankik_data.db"  # Adjust the path if needed
EXPORT_PATH = "../src/assets/search.json"

def export_to_json():
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
    os.makedirs(os.path.dirname(EXPORT_PATH), exist_ok=True)

    # Write to JSON
    with open(EXPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    conn.close()
    print(f"✅ Database exported successfully to {EXPORT_PATH}")

if __name__ == "__main__":
    export_to_json()
