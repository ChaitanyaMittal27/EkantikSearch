# Initial Populate Process – Ekantik_QS

This folder contains all scripts needed to **initialize the database and export the frontend files** from scratch.

If the database is ever lost or reset, simply run `populateDB.py` to fully regenerate all required data.

---

## ✅ What This Does

`populateDB.py` automates the full data pipeline:

1. **Fetch all videos** from the YouTube channel using the Data API
2. **Filter relevant videos** containing `#XXX` format in the title
3. **Extract questions** from video descriptions and insert into the local DB
4. **Export** the final data to `public/all.json` and `public/all_qs.json`
5. **Archive** the data snapshot to `db/db_archives/`

---

## 📁 Files in This Folder

| Script                    | Purpose                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `fetchVideoList.py`       | Fetches all videos from YouTube and saves them to `all_videos.txt`                   |
| `filterRelevantVideos.py` | Filters only those videos with `#XXX` in their titles                                |
| `setupAndPopulateDB.py`   | Downloads video descriptions, extracts questions, and inserts them into the database |
| `populateDB.py`           | Runs the complete pipeline described above                                           |
| `population_log.txt`      | Log file generated during population                                                 |
| `failed_details.txt`      | Logs any video where questions couldn’t be extracted                                 |

---

## 🔁 To Run

1. Navigate to backend/
2. Execute:

```bash
python initial_populate/populateDB.py
```
