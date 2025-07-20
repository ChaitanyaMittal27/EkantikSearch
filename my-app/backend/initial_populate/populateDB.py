"""
populateDB.py - Runs the full update process.

Run from the backend directory to ensure all paths are correct.

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
DB_PUBLIC_PATH = os.path.join(BASE_DIR, "../../public/all.json")  # Frontend JSON storage
DB_QUES_PUBLIC_PATH = os.path.join(BASE_DIR, "../../public/all_qs.json")  # Frontend JSON storage
DB_ARCHIVE_PATH = os.path.join(BASE_DIR, "../db/db_archives", f"all_{datetime.datetime.now().strftime('%Y%m%d')}.json")  # Archive storage


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
    run_command("python initial_populate/fetchVideoList.py")

    # Step 2: Filter relevant videos with #DDD in title
    run_command("python initial_populate/filterRelevantVideos.py")

    # Step 3: Fetch descriptions, extract questions, and insert into DB
    run_command("python initial_populate/setupAndPopulateDB.py")

    print("✅ Database setup and update completed successfully!")

    # Step 4: Export the database to JSON for frontend
    #run_command(f"python db/export_to_json.py {DB_PUBLIC_PATH}")

    # Step 5: Archive the exported JSON for historical backups
    #run_command(f"python db/export_to_json.py {DB_ARCHIVE_PATH}")

    # Step 6: Export the questions to JSON for frontend
    #run_command(f"python db/export_qs_to_json.py {DB_QUES_PUBLIC_PATH}")

    #print("✅ Database update and export completed successfully!")
