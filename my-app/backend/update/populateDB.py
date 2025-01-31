"""
populateDB.py - Runs the full update process.

This script:
1. Fetches latest video list.
2. Filters relevant videos.
3. Extracts descriptions and inserts questions into `ekankik_data.db`.
4. Exports final data to `src/assets/all.json`.
5. Archives the exported JSON to `backend/db_archives`.

This ensures that the database and frontend are always in sync.
"""

import os
import datetime

# Define paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
ASSETS_PATH = os.path.join(BASE_DIR, "../../src/assets/all.json")
ARCHIVE_PATH = os.path.join(BASE_DIR, "../db/db_archives", f"all_{datetime.datetime.now().strftime('%Y%m%d')}.json")

def run_command(command):
    """Runs a shell command and exits if it fails."""
    print(f"🔹 Running: {command}")
    result = os.system(command)
    if result != 0:
        print(f"❌ ERROR: Command failed: {command}")
        exit(1)

if __name__ == "__main__":
    print("🚀 Starting full database update process...")

    # Step 1: Fetch all videos from YouTube API
    run_command("python update/fetchVideoList.py")

    # Step 2: Filter relevant videos with #XXX in title
    run_command("python update/filterRelevantVideos.py")

    # Step 3: Fetch descriptions, extract questions, and insert into DB
    run_command("python update/setupAndPopulateDB.py")

    # Step 4: Export the database to JSON for frontend
    run_command(f"python db/export_to_json.py {ASSETS_PATH}")

    # Step 5: Archive the exported JSON for historical backups
    run_command(f"python db/export_to_json.py {ARCHIVE_PATH}")

    print("✅ Database update and export completed successfully!")
