import requests
import argparse
import time
from datetime import datetime, timedelta
import re
import os
import sys

# Ensure we can import database
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database import init_db, upsert_tool

GITHUB_API_URL = "https://api.github.com/search/repositories"
HF_API_URL = "https://huggingface.co/api/models"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

CATEGORIES_MAP = {
    "chatbot": "AI Chatbots",
    "chat": "AI Chatbots",
    "assistant": "AI Chatbots",
    "presentation": "Presentation",
    "slide": "Presentation",
    "coding": "Coding",
    "copilot": "Coding",
    "code": "Coding",
    "ide": "Coding",
    "email": "Email",
    "mail": "Email",
    "image-generation": "Image Generation",
    "diffusion": "Image Generation",
    "text-to-image": "Image Generation",
    "spreadsheet": "Spreadsheet",
    "excel": "Spreadsheet",
    "csv": "Spreadsheet",
    "writing": "Writing",
    "editor": "Writing",
    "scheduling": "Scheduling",
    "calendar": "Scheduling",
    "meeting": "Meeting Notes",
    "transcription": "Meeting Notes",
    "video": "Video Generation",
    "workflow": "Workflow Automation",
    "automation": "Workflow Automation",
    "agent": "Workflow Automation",
    "design": "Graphic Design",
    "graphic": "Graphic Design",
    "knowledge": "Knowledge Management",
    "wiki": "Knowledge Management",
    "visualization": "Data Visualization",
    "plot": "Data Visualization",
    "chart": "Data Visualization",
}

def determine_category(description, topics):
    """Maps description and topics to a category."""
    text = (description or "").lower() + " " + " ".join(topics or [])

    for key, category in CATEGORIES_MAP.items():
        if key in text:
            return category

    return "Other"

def check_pricing(repo_full_name, default_branch="main"):
    """Heuristic to check for pricing in README."""
    try:
        url = f"https://raw.githubusercontent.com/{repo_full_name}/{default_branch}/README.md"
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            content = resp.text.lower()
            if "pricing" in content or "subscribe" in content or "pro plan" in content or "enterprise" in content:
                if "free tier" in content or "community edition" in content:
                    return "Freemium"
                return "Paid"
            return "Free/Open Source"
    except:
        pass
    return "Unknown"

def calculate_score(stars, forks, updated_at):
    """Calculates a popularity score."""
    score = stars * 1.0 + forks * 2.0

    # Boost if updated recently (last 30 days)
    last_update = datetime.strptime(updated_at, "%Y-%m-%dT%H:%M:%SZ")
    if datetime.now() - last_update < timedelta(days=30):
        score *= 1.2

    return round(score, 2)

def scrape_github(limit=20):
    print(f"Scraping GitHub (limit={limit})...")
    # Simplified query to avoid 422
    query = "topic:ai stars:>1000"
    params = {
        "q": query,
        "sort": "stars",
        "order": "desc",
        "per_page": limit
    }

    headers = {}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"

    try:
        resp = requests.get(GITHUB_API_URL, params=params, headers=headers)
        if resp.status_code != 200:
            print(f"Error fetching GitHub: {resp.status_code}")
            return

        data = resp.json()
        items = data.get("items", [])

        for item in items:
            name = item['name']
            full_name = item['full_name']
            print(f"Processing {full_name}...")

            category = determine_category(item['description'], item.get('topics', []))
            pricing = check_pricing(full_name, item.get('default_branch', 'main'))
            score = calculate_score(item['stargazers_count'], item['forks_count'], item['updated_at'])

            tool_data = {
                "name": name,
                "description": item['description'],
                "url": item['html_url'],
                "repo_url": item['html_url'],
                "category": category,
                "pricing": pricing,
                "stars": item['stargazers_count'],
                "forks": item['forks_count'],
                "downloads": 0, # GitHub doesn't expose downloads easily
                "license": item['license']['name'] if item['license'] else "None",
                "created_at": datetime.strptime(item['created_at'], "%Y-%m-%dT%H:%M:%SZ"),
                "last_updated": datetime.strptime(item['updated_at'], "%Y-%m-%dT%H:%M:%SZ"),
                "score": score
            }

            upsert_tool(tool_data)

    except Exception as e:
        print(f"GitHub Scrape Error: {e}")

def scrape_huggingface(limit=20):
    print(f"Scraping Hugging Face (limit={limit})...")
    params = {
        "sort": "downloads",
        "direction": "-1",
        "limit": limit,
        "filter": "text-generation" # Focus on LLMs
    }

    try:
        resp = requests.get(HF_API_URL, params=params)
        if resp.status_code != 200:
            print(f"Error fetching Hugging Face: {resp.status_code}")
            return

        models = resp.json()

        for model in models:
            name = model['modelId']
            print(f"Processing HF Model {name}...")

            # Heuristic mapping for HF
            category = "Coding" if "code" in name.lower() else "Writing"

            tool_data = {
                "name": name.split('/')[-1],
                "description": f"Hugging Face Model: {name}",
                "url": f"https://huggingface.co/{name}",
                "repo_url": f"https://huggingface.co/{name}",
                "category": category,
                "pricing": "Free/Open Source", # Most HF models are open
                "stars": model.get('likes', 0),
                "forks": 0,
                "downloads": model.get('downloads', 0),
                "license": "Open Source", # Simplified
                "created_at": datetime.now(), # HF API doesn't always give creation date in simple list
                "score": model.get('downloads', 0) * 0.1 + model.get('likes', 0) * 5
            }

            upsert_tool(tool_data)

    except Exception as e:
        print(f"HF Scrape Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AI Tools Scraper")
    parser.add_argument("--dry-run", action="store_true", help="Run with limited scope")
    args = parser.parse_args()

    init_db()

    limit = 5 if args.dry_run else 50
    scrape_github(limit)
    scrape_huggingface(limit)

    print("Scraping completed.")
