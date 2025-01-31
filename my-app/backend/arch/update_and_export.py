"""
update_and_export.py - Full update workflow for GitHub Actions.

This script:
- Runs `update_DB.py` to update the database.
- Runs `export_to_json.py` twice:
  1. Saves `all.json` in `src/assets/` for frontend access.
  2. Archives the JSON as `backend/db_archives/all_<timestamp>.json`.

This is meant to be triggered by GitHub Actions.
"""

import os
import datetime

print("🚀 Running full update process...")

# Step 1: Update the database
os.system("python update_DB.py")

# Step 2: Export updated database to JSON
os.system("python export_to_json.py src/assets/all.json")

# Step 3: Archive the JSON file with a timestamp
timestamp = datetime.datetime.now().strftime('%Y%m%d')
os.system(f"python export_to_json.py backend/db_archives/all_{timestamp}.json")

print("✅ Update and export process completed successfully!")
