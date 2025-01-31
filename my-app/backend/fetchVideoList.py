"""
fetchVideoList.py - Fetches all video titles and IDs from a YouTube channel.

This script:
- Uses the YouTube Data API to retrieve all uploaded videos.
- Saves video IDs, titles, and upload dates to `backend/all_videos.txt`.
- Ensures paginated results are handled efficiently.

Requirements:
- Requires an API key stored in `key.py`.
- The YouTube channel ID should be correctly set.

Output:
- `backend/all_videos.txt` (List of video IDs, dates, and titles).
"""


import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv(dotenv_path="../.env")

# Retrieve API key
API_KEY = os.getenv("YOUTUBE_API_KEY")

if not API_KEY:
    raise ValueError("❌ API_KEY is missing! Make sure it's set in the .env file.")

# 🔹 YouTube channel ID for Bhajan Marg
CHANNEL_ID = "UCEk1jBxAl6fe-_G37G7huQA"

# 🔹 YouTube API URL for fetching uploads playlist ID
CHANNEL_URL = f"https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id={CHANNEL_ID}&key={API_KEY}"

# 🔹 Output file to store video list
OUTPUT_FILE = "all_videos.txt"

def get_uploads_playlist_id():
    """
    Fetches the uploads playlist ID of the channel.
    This playlist contains all videos uploaded by the channel.
    """
    response = requests.get(CHANNEL_URL)
    data = response.json()
    
    try:
        return data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    except (KeyError, IndexError):
        print("Error: Could not retrieve uploads playlist ID. Check API Key and Channel ID.")
        return None

def fetch_video_list(playlist_id):
    """
    Retrieves all video titles and IDs from the uploads playlist.
    Saves them to 'all_videos.txt' for further filtering.
    """
    video_list = []
    next_page_token = ""

    while True:
        url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&maxResults=50&pageToken={next_page_token}&key={API_KEY}"
        response = requests.get(url)
        data = response.json()

        # 🔹 Extract video details
        for item in data.get("items", []):
            video_title = item["snippet"]["title"]
            video_id = item["snippet"]["resourceId"]["videoId"]
            video_date = item["snippet"]["publishedAt"][:10]  # Extract YYYY-MM-DD

            video_list.append(f"{video_id} | {video_date} | {video_title}")

        # 🔹 Check if there is another page of results
        next_page_token = data.get("nextPageToken", "")
        if not next_page_token:
            break

    return video_list

if __name__ == "__main__":
    print("🔹 Fetching uploads playlist ID...")
    uploads_playlist_id = get_uploads_playlist_id()

    if uploads_playlist_id:
        print("🔹 Retrieving all video titles and IDs...")
        videos = fetch_video_list(uploads_playlist_id)

        # Save to file
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            for video in videos:
                f.write(video + "\n")

        print(f"✅ Successfully saved {len(videos)} videos to {OUTPUT_FILE}")
    else:
        print("❌ Failed to retrieve video list.")
