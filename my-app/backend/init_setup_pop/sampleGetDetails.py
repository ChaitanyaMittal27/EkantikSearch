import requests
from dotenv import load_dotenv
import os

TEST_VIDEO_ID =  "BERx9L9_JFA"  #"YOUR_VIDEO_ID"


# Load environment variables from .env
load_dotenv(dotenv_path="../.env")

# Retrieve API key
API_KEY = os.getenv("YOUTUBE_API_KEY")

if not API_KEY:
    raise ValueError("❌ API_KEY is missing! Make sure it's set in the .env file.")


def fetch_video_description(video_id):
    """Fetches and prints the description of a single video."""
    url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={TEST_VIDEO_ID}&key={API_KEY}"
    response = requests.get(url)
    data = response.json()

    try:
        description = data["items"][0]["snippet"]["description"]
        print("🔹 Video Description Extracted:\n")
        # print(description) #DEBUG
        
        # Save output for further analysis
        with open("test_description.txt", "w", encoding="utf-8") as f:
            f.write(description)
        
        print("✅ Description saved to test_description.txt")
    except (KeyError, IndexError):
        print(f"❌ Failed to fetch description for video {video_id}")

if __name__ == "__main__":
    fetch_video_description(TEST_VIDEO_ID)
