# 📌 Backend Overview - Ekantik_QS

Welcome to the **Ekantik_QS Backend**! This folder contains all the scripts necessary for managing the question search database. This project **fetches YouTube video data, extracts questions, updates the SQLite database, and exports data to JSON** for the frontend.

## 📂 Folder Structure
```
backend/
├── db/                     # SQLite database and related scripts
│   ├── ekankik_data.db     # Main database storing questions
│   ├── db_controller.py    # Handles database setup and insertions
│   ├── export_to_json.py   # Exports full DB to JSON for frontend
│   ├── export_qs_to_json.py # Exports only questions to JSON
│
├── update/                 # Scripts for fetching and processing YouTube data
│   ├── fetchVideoList.py    # Fetches all YouTube videos using API
│   ├── filterRelevantVideos.py # Filters videos containing questions
│   ├── setupAndPopulateDB.py  # Extracts questions and inserts into DB
│   ├── populateDB.py        # Master script that runs all update steps
│
├── data/                    # Storage for intermediate files
│   ├── all_videos.txt        # Raw list of all fetched YouTube videos
│   ├── filtered_videos.txt   # Filtered videos containing questions
│   ├── failed_details.txt    # Logs videos where no questions were found
│   ├── missingafterfilter.txt # Logs missing video numbers
│
└── README.md                # This documentation file
```

## ⚙️ How the Backend Works
The backend follows a structured **data pipeline**:

### 1️⃣ Fetch Videos from YouTube
📌 **Script:** `fetchVideoList.py`
- Uses the YouTube API to fetch all uploaded videos.
- Saves the list to `all_videos.txt`.

### 2️⃣ Filter Videos with Questions
📌 **Script:** `filterRelevantVideos.py`
- Scans `all_videos.txt` and keeps only videos with `#XXX` numbers in the title.
- Saves filtered results to `filtered_videos.txt`.
- Logs missing videos in `missingafterfilter.txt`.

### 3️⃣ Extract Questions & Insert into Database
📌 **Script:** `setupAndPopulateDB.py`
- Reads `filtered_videos.txt` and fetches **video descriptions**.
- Extracts timestamps and questions using regex.
- Inserts extracted questions into **`ekankik_data.db`**.
- Logs videos with missing questions in `failed_details.txt`.

### 4️⃣ Export Data to JSON for Frontend
📌 **Scripts:** `export_to_json.py`, `export_qs_to_json.py`
- **`export_to_json.py`**: Exports **all** database questions to `public/all.json`.
- **`export_qs_to_json.py`**: Exports **only question texts** to `public/all_qs.json`.
- **Ensures old JSON files are overwritten** to keep frontend updated.

### 5️⃣ Run Full Update
📌 **Master Script:** `populateDB.py`
- Runs **all** the above steps in sequence.
- Ensures **database and frontend JSON are always in sync**.

## 🚀 How to Run the Backend
To manually update the database, run:
```bash
python update/populateDB.py
```
To check if the latest data is inserted, run:
```bash
sqlite3 db/ekankik_data.db "SELECT MAX(video_index) FROM questions;"
```
To manually export JSON:
```bash
python db/export_to_json.py public/all.json
python db/export_qs_to_json.py public/all_qs.json
```

## 🛠 Troubleshooting
### ❌ JSON Not Updating?
- Delete old JSON files manually:
  ```bash
  rm -f public/all.json public/all_qs.json
  ```
- Re-run export scripts.
- Ensure `setupAndPopulateDB.py` successfully inserts new questions.

### ❌ New Videos Not Appearing in Database?
- Check if they exist in `filtered_videos.txt`.
- Check logs in `failed_details.txt`.
- Run:
  ```bash
  sqlite3 db/ekankik_data.db "SELECT * FROM questions ORDER BY video_index DESC LIMIT 5;"
  ```

## ✅ Summary
This backend **automates fetching, filtering, extracting, storing, and exporting YouTube Q&A data** for the frontend search. Everything updates via `populateDB.py`, and the JSON files are continuously refreshed for frontend use.

---

🔹 **Last Updated:** $(date)
🔹 **Author:** Your Name / Team Name

