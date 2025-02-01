#!/usr/bin/env python3
"""
export_questions_to_json.py - Exports questions and their identification index from the database.

This script:
1. Connects to the SQLite database (ekankik_data.db).
2. Extracts the question ID and question text from the "questions" table.
3. Exports the data to a JSON file at the specified output path.
"""

import sqlite3
import json
import sys
import os

def export_questions_to_json(output_path):
    # Path to the SQLite database. Adjust if needed.
    db_path = os.path.join(os.path.dirname(__file__), "ekankik_data.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Query to fetch id and question text from the questions table.
    query = "SELECT id, question_text FROM questions"
    cursor.execute(query)
    rows = cursor.fetchall()

    # Create a list of dictionaries with the desired fields.
    questions = [{"id": row[0], "question": row[1]} for row in rows]

    # Write the questions to a JSON file.
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=4)

    print(f"Exported {len(questions)} questions to {output_path}")
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python export_questions_to_json.py <output_path>")
        sys.exit(1)

    output_path = sys.argv[1]
    export_questions_to_json(output_path)