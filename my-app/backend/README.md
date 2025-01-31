# 🛠️ Initial Setup & Population (`init_setup_pop/`)

## 📌 Purpose
This folder contains scripts and data files used for the **initial setup** of the `Ekantik_DB` project. These scripts were used **only once** to fetch YouTube video details, extract questions, and populate the database (`data.db`). 

🔹 **Note:**  
These scripts were originally run **inside the `backend/` folder** before being moved here for archival purposes. The database (`data.db`) is now fully set up, and these scripts are no longer needed for normal operation.

---

## 📂 Folder Contents

### **1️⃣ `fetchVideoList.py`**
**Purpose:** Fetches all video titles and IDs from the YouTube channel.  
- Uses the **YouTube Data API** to retrieve uploaded videos.
- Saves video details (ID, date, title) to `all_videos.txt`.

---

### **2️⃣ `filterRelevantVideos.py`**
**Purpose:** Filters only the relevant videos.  
- Reads `all_videos.txt`.
- Extracts videos with `#XXX` format in the title.
- Saves filtered results to `filtered_videos.txt`.

---

### **3️⃣ `setupAndPopulateDB.py`**
**Purpose:** Fetches video descriptions, extracts questions, and stores them in `data.db`.  
- Reads `filtered_videos.txt` line by line.
- Fetches video descriptions from **YouTube Data API**.
- Extracts **timestamps & questions**.
- Inserts extracted questions into the **SQLite `questions` table**.
- Logs failed videos in `failed_details.txt`.

---

## 📄 Associated Data Files

### **✔️ `all_videos.txt`**
- Contains a **list of all fetched videos** from the YouTube channel.

### **✔️ `filtered_videos.txt`**
- Contains **only relevant videos** (those matching `#XXX` format).

### **✔️ `failed_details.txt`**
- Contains **logs of videos that could not be processed** due to missing descriptions or incorrect formatting.

---

## ❌ Are These Files Needed Again?
No. These scripts and files were required **only once** to populate `data.db`.  
Moving forward, **all database operations will be managed via `db_controller.py` and Flask API**.