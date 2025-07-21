"""
updateDB.py - Runs the incremental update pipeline and exports data.

1. Fetch new videos after latest DB entry.
2. Filter for #XXX videos.
3. Insert into DB.
4. Export JSONs for frontend.

To be used via cronjob or manual trigger.
"""

import os
from datetime import datetime

PUBLIC_JSON = "../../public/all.json"
PUBLIC_QS = "../../public/all_qs.json"
ARCHIVE_JSON = f"backend/db/db_archives/all_{datetime.now().strftime('%Y%m%d')}.json"

def run(cmd):
    print(f"▶️ {cmd}")
    exit_code = os.system(cmd)

    if exit_code == 0:
        return 0
    elif exit_code == 1: # custom exit code handle
        return 1
    else:
        print(f"❌ Error: {cmd} (exit code {exit_code})")
        exit(1)

if __name__ == "__main__":
    print("🔹 Starting updateDB...")
    fetch_result = run("python update/fetchNewVideos.py")
    if fetch_result == 1:
        print("❌ No new videos. Exiting...")
        exit(1)
    run("python update/filterNewRelevant.py")
    run("python update/updateAndInsert.py")
    print("✅ Update complete. Database and frontend synced.")
    
