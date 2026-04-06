import requests
import json
import os

API_KEY    = os.environ["YOUTUBE_API_KEY"]
CHANNEL_ID = "UC1O24WAzLuYg6yNrlPqLABw"

def parse_duration(iso):
    import re
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', iso or '')
    if not m:
        return ''
    h   = int(m.group(1) or 0)
    min = int(m.group(2) or 0)
    s   = int(m.group(3) or 0)
    if h:
        return f"{h}:{str(min).zfill(2)}:{str(s).zfill(2)}"
    return f"{min}:{str(s).zfill(2)}"

def fetch_all_videos():
    videos = []
    token  = ''

    while True:
        params = {
            "part":      "snippet",
            "channelId": CHANNEL_ID,
            "maxResults": 50,
            "order":     "date",
            "type":      "video",
            "key":       API_KEY,
        }
        if token:
            params["pageToken"] = token

        r    = requests.get("https://www.googleapis.com/youtube/v3/search", params=params)
        data = r.json()

        if not r.ok:
            raise Exception(f"YouTube API error {r.status_code}: {data}")

        ids = [item["id"]["videoId"] for item in data.get("items", []) if item["id"].get("videoId")]

        # Fetch stats + duration
        stats_map = {}
        if ids:
            sr = requests.get(
                "https://www.googleapis.com/youtube/v3/videos",
                params={"part": "statistics,contentDetails", "id": ",".join(ids), "key": API_KEY}
            )
            for item in sr.json().get("items", []):
                stats_map[item["id"]] = {
                    "views":    int(item["statistics"].get("viewCount", 0)),
                    "duration": parse_duration(item["contentDetails"].get("duration", "")),
                }

        for item in data.get("items", []):
            vid = item["id"].get("videoId")
            if not vid:
                continue
            sn = item["snippet"]
            videos.append({
                "id":       vid,
                "title":    sn["title"],
                "desc":     sn["description"],
                "thumb":    sn["thumbnails"].get("high", sn["thumbnails"].get("medium", {})).get("url", ""),
                "date":     sn["publishedAt"],
                "views":    stats_map.get(vid, {}).get("views",    0),
                "duration": stats_map.get(vid, {}).get("duration", ""),
            })

        token = data.get("nextPageToken", "")
        if not token:
            break

    return videos

def fetch_channel_stats():
    r = requests.get(
        "https://www.googleapis.com/youtube/v3/channels",
        params={"part": "statistics", "id": CHANNEL_ID, "key": API_KEY}
    )
    items = r.json().get("items", [])
    return items[0]["statistics"] if items else {}

# --- Main ---
print("מושך סרטונים...")
videos = fetch_all_videos()
print(f"נמצאו {len(videos)} סרטונים")

ch = fetch_channel_stats()

output = {
    "videos":      videos,
    "channelStats": {
        "viewCount":       int(ch.get("viewCount",       0)),
        "subscriberCount": int(ch.get("subscriberCount", 0)),
        "videoCount":      int(ch.get("videoCount",      0)),
    }
}

with open("videos.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("✅ videos.json נשמר בהצלחה")
