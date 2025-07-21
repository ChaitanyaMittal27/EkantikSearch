"""
updateDB.py - Runs the incremental update pipeline and exports data.

1. Fetch new videos after latest DB entry.
2. Filter for #XXX videos.
3. Insert into DB.
4. Export JSONs for frontend.

To be used via cronjob or manual trigger.
"""

import sys, os
from datetime import datetime, timezone

class TeeLogger:
    def __init__(self, log_path):
        self.terminal = sys.stdout
        self.log = open(log_path, "a", encoding="utf-8")
        self.start_new_block()

    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)

    def flush(self):
        self.terminal.flush()
        self.log.flush()

    def start_new_block(self):
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        self.log.write(f"\n\n=======================\n🗓️  {timestamp}\n")
        self.terminal.write(f"\n🗓️  {timestamp}\n")

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
    sys.stdout = TeeLogger("update/update_log.txt")
    print("🔹 Starting updateDB...")
    fetch_result = run("python update/fetchNewVideos.py")
    if fetch_result == 1:
        print("❌ No new videos. Exiting...")
        exit(1)
    run("python update/filterNewRelevant.py")
    run("python update/updateAndInsert.py")
    print("✅ Update complete. Database and frontend synced.")
    
