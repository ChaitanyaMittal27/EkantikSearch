===========================
🛠️  EKANTIK_QS – UPDATE SYSTEM
===========================

This folder contains the **incremental update pipeline** for the Ekantik_QS platform. It automatically syncs new content from YouTube to the Supabase database and keeps frontend data in sync (via optional JSON export).

Used both **manually** and via **GitHub Actions CI/CD**.

────────────────────────────
📦 WHAT IT DOES
────────────────────────────

When you run:

    python update/updateDB.py

It performs:

1. ✅ Fetch all videos from the Ekantik YouTube channel
2. ✅ Compare against Supabase (by video_index) to detect *new* ones
3. ✅ Save new entries to `new_videos.txt` and `new_filtered.txt`
4. ✅ Extract questions from each video and insert *only* missing ones
5. ✅ Log the full process to `update/update_log.txt`

────────────────────────────
📁 FILES IN THIS FOLDER
────────────────────────────

fetchNewVideos.py
→ Fetches video metadata using YouTube API
→ Saves only videos with higher `#XXX` than latest in DB

filterNewRelevant.py
→ Filters the above to include only videos with `#XXX` in title

updateAndInsert.py
→ Downloads video descriptions
→ Extracts timestamped questions
→ Inserts to Supabase DB (skips duplicates)

updateDB.py
→ Orchestrates the full pipeline above
→ Logs all console output to `update_log.txt`

────────────────────────────
📤 OUTPUT FILES
────────────────────────────

- new_videos.txt        → All newly detected videos (raw)
- new_filtered.txt      → Only `#XXX` videos (relevant subset)
- update_log.txt        → Full timestamped log of each run

────────────────────────────
🛑 EXIT BEHAVIOR
────────────────────────────

- If **no new videos** found: exits early with code 1
- If errors occur (e.g. network/API failure): exits with error code
- Prevents unnecessary filtering/exporting if no new content

────────────────────────────
📝 LOGGING SYSTEM
────────────────────────────

All `print()` output from this script **and any child script** is automatically:

- Written to console (visible in terminal or CI log)
- Appended to `update_log.txt` using a custom `TeeLogger`

────────────────────────────
🚀 CI/CD AUTOMATION
────────────────────────────

This script is automatically triggered by GitHub Actions:

- Runs nightly (00:00 UTC)
- Only commits/pushes JSON exports if new data is found
- Fails early and exits silently if no updates

See `.github/workflows/update.yml` for full automation config.