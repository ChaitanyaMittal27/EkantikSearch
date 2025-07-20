import requests
import re
import sys
import os
from dotenv import load_dotenv
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from db.db_controller import TableEntry, insert_into_db

# 🔹 Input file with relevant video IDs
FILTERED_VIDEOS_FILE = "update/filtered_videos.txt"
# 🔹 Failed videos log file
FAILED_DETAILS_FILE = "update/failed_details.txt"
# Load environment variables from .env
load_dotenv(dotenv_path="../.env")

# Retrieve API key
API_KEY = os.getenv("YOUTUBE_API_KEY") 

if not API_KEY:
    raise ValueError("❌ API_KEY is missing! Make sure it's set in the .env file.")

# 🔹 Function to fetch video descriptions from YouTube Data API
def fetch_video_description(video_id):
    """Fetches the description of a video using the YouTube Data API."""
    url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={video_id}&key={API_KEY}"
    response = requests.get(url)
    data = response.json()

    try:
        return data["items"][0]["snippet"]["description"]
    except (KeyError, IndexError):
        print(f"❌ Error: Could not fetch description for video {video_id}")
        return None

# 🔹 Function to extract timestamps and questions from video descriptions
def parse_questions(description):
    """Extracts timestamps and questions from the video description."""
    pattern = re.compile(r"(\d{2}:\d{2})\s*-+\s*(.+)")  # Matches timestamps and questions
    matches = pattern.findall(description)
    
    # Store extracted questions
    return [{"timestamp": ts, "question": q.strip()} for ts, q in matches]

# extracting the video index from the video title
def extract_video_index(line: str):
    """
    Extracts the video index from a string like:
    "#806 Ekantik Vartalaap & Darshan/ 31-01-2025/"
    Returns the number as an integer.
    """
    match = re.match(r"#(\d+)", line)
    if match:
        return int(match.group(1))
    else:
        return None

# 🔹 Main function to process filtered videos and store data in the database
def main():
    """Reads filtered videos, fetches descriptions, extracts questions, and inserts into the database."""
    
    failed_videos = []  # List to store failed videos

    with open(FILTERED_VIDEOS_FILE, "r", encoding="utf-8") as infile:
        for line in infile:
            parts = line.strip().split(" | ")
            if len(parts) != 3:
                print(f"❌ Error: Invalid format in filtered_videos.txt: {line.strip()}")
                sys.exit(1)  # Stop execution if file format is incorrect

            video_id, video_date, video_title = parts
            video_url = f"https://www.youtube.com/watch?v={video_id}"

            print(f"🔹 Processing: {video_title} ({video_id})")

            # Fetch video description
            description = fetch_video_description(video_id)
            if description is None:
                print(f"⚠️ Skipping {video_title} due to missing description.")
                failed_videos.append(f"{video_id} | {video_title} | Missing Description")
                continue

            # Extract timestamps & questions
            questions = parse_questions(description)
            if not questions:
                print(f"⚠️ No questions found in {video_title}, skipping.")
                failed_videos.append(f"{video_id} | {video_title} | No Questions Found")
                continue


            # Convert extracted data into TableEntry objects and insert into DB
            for i, q in enumerate(questions):
                entry = TableEntry(
                    question_text=q["question"],
                    video_url=video_url,
                    timestamp=q["timestamp"],
                    video_date=video_date,
                    video_index=extract_video_index(video_title),
                    video_question_index=i
                )
                insert_into_db(entry)  # Insert each entry immediately

    # Save failed videos log
    with open(FAILED_DETAILS_FILE, "w", encoding="utf-8") as outfile:
        for failed in failed_videos:
            outfile.write(failed + "\n")

    print("✅ All videos processed successfully! Data saved in the db.")
    print(f"📌 Failed video details logged in {FAILED_DETAILS_FILE}")

if __name__ == "__main__":
    main()
