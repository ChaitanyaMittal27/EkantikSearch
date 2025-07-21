"""
updateAndInsert.py - Reads update/new_filtered.txt, extracts questions, inserts into DB.

Supports parameter override via CLI or import.
"""

import requests, os, re, sys, logging
from dotenv import load_dotenv

# 🔧 Fix path to allow importing from db/
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from db.db_controller import TableEntry, insert_batch

load_dotenv(dotenv_path="../.env")
API_KEY = "AIzaSyDG3XoaR8QcNbYn5b7ZesuA8NqvuZRh8bg" #os.getenv("YOUTUBE_API_KEY")
CHUNK_SIZE = 200

DEFAULT_FILTERED = "update/new_filtered.txt"
DEFAULT_FAILED = "update/failed_details.txt"
LOG_PATH = "update/update_log.txt"

logging.basicConfig(filename=LOG_PATH, filemode="a", level=logging.INFO, format="%(asctime)s - %(message)s")
def log(msg): print(msg); logging.info(msg)

def fetch_description(video_id):
    url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={video_id}&key={API_KEY}"
    return requests.get(url).json().get("items", [{}])[0].get("snippet", {}).get("description")

def parse_questions(desc):
    return [{"timestamp": ts, "question": q.strip()} for ts, q in re.findall(r"(\d{2}:\d{2})\s*-+\s*(.+)", desc)]

def extract_index(title):
    match = re.match(r"#(\d+)", title)
    return int(match.group(1)) if match else None

def run_insert(filtered_file=DEFAULT_FILTERED, failed_log=DEFAULT_FAILED):
    failed = []
    with open(filtered_file, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split(" | ")
            if len(parts) != 3: continue
            vid, date, title = parts
            url = f"https://www.youtube.com/watch?v={vid}"
            desc = fetch_description(vid)
            if not desc:
                failed.append(f"{vid} | {title} | No description")
                continue
            qs = parse_questions(desc)
            if not qs:
                failed.append(f"{vid} | {title} | No questions")
                continue
            entries = [TableEntry(q["question"], url, q["timestamp"], date, extract_index(title), i) for i, q in enumerate(qs)]
            for i in range(0, len(entries), CHUNK_SIZE):
                insert_batch(entries[i:i + CHUNK_SIZE])
                log(f"Inserted {len(entries[i:i + CHUNK_SIZE])} Qs from #{extract_index(title)}")
    with open(failed_log, "w", encoding="utf-8") as f:
        for fail in failed:
            f.write(fail + "\n")

if __name__ == "__main__":
    print("🔹 Starting update and insert process...")
    run_insert()
    print("✅ Update and insert complete. Database updated with new questions. \n")
