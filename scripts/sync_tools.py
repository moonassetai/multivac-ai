
import os
import json
import requests
import datetime
import re

# ==========================================
# CONFIGURATION
# ==========================================
OUTPUT_FILE = "src/data/tools.json"

# GitHub API Headers (Add your token to env if hitting rate limits)
HEADERS = {
    "Accept": "application/vnd.github.v3+json"
}
if os.environ.get("GH_TOKEN"):
    HEADERS["Authorization"] = f"token {os.environ.get('GH_TOKEN')}"

# ==========================================
# STATIC DATA: "PROPRIETARY GIANTS"
# ==========================================
# These are the popular tools that won't be found via GitHub scraping
STATIC_TOOLS = [
    {
        "name": "ChatGPT",
        "description": "OpenAI's state-of-the-art conversational AI model.",
        "url": "https://chat.openai.com",
        "category": "AI Chatbots",
        "pricing": "Freemium",
        "stars": 1000000, # Artificial boost for sorting
        "source": "static"
    },
    {
        "name": "Claude",
        "description": "Anthropic's helpful and harmless AI assistant.",
        "url": "https://claude.ai",
        "category": "AI Chatbots",
        "pricing": "Freemium",
        "stars": 900000,
        "source": "static"
    },
    {
        "name": "Midjourney",
        "description": "Advanced AI image generation tool via Discord.",
        "url": "https://midjourney.com",
        "category": "AI Image Generation",
        "pricing": "Paid",
        "stars": 950000,
        "source": "static"
    },
    {
        "name": "DeepSeek",
        "description": "Powerful open-source LLMs and chatbots.",
        "url": "https://chat.deepseek.com",
        "category": "AI Chatbots",
        "pricing": "Free",
        "stars": 850000,
        "source": "static"
    },
    {
        "name": "GitHub Copilot",
        "description": "Your AI pair programmer.",
        "url": "https://github.com/features/copilot",
        "category": "AI Coding Assistance",
        "pricing": "Paid",
        "stars": 800000,
        "source": "static"
    },
    {
        "name": "Perplexity",
        "description": "AI-powered search engine.",
        "url": "https://perplexity.ai",
        "category": "AI Chatbots",
        "pricing": "Freemium",
        "stars": 880000,
        "source": "static"
    },
    {
        "name": "Canva",
        "description": "Graphic design tool with powerful AI features.",
        "url": "https://canva.com",
        "category": "AI Graphic Design",
        "pricing": "Freemium",
        "stars": 700000,
        "source": "static"
    }
]

# ==========================================
# CATEGORY MAPPING
# ==========================================
CATEGORY_KEYWORDS = {
    "AI Chatbots": ["chatbot", "chatgpt", "llm chat", "conversational"],
    "AI Coding Assistance": ["copilot", "code completion", "coding assistant", "vs code", "autocomplete"],
    "AI Image Generation": ["stable diffusion", "image generation", "text-to-image", "midjourney", "dall-e"],
    "AI Video Generation": ["text-to-video", "video generation", "sora", "runway"],
    "AI Writing Generation": ["copywriting", "text generation", "writer", "jasper"],
    "AI Presentation": ["presentation", "slides", "powerpoint"],
    "AI Spreadsheet": ["spreadsheet", "excel", "csv", "data analysis"],
    "AI Meeting Notes": ["transcription", "meeting", "notes", "summary"],
    "AI Workflow Automation": ["automation", "workflow", "n8n", "zapier", "agent"],
    "AI Knowledge Management": ["knowledge base", "notion", "wiki", "obsidian"],
    "AI Data Visualization": ["visualization", "charts", "plotting", "dashboard"]
}

DEFAULT_CATEGORY = "AI Productivity"

# ==========================================
# HELPERS
# ==========================================

def get_category(name, description, topics):
    """Categorize tool based on keywords in name/desc/topics."""
    text = f"{name} {description} {' '.join(topics)}".lower()
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text:
                return category
    
    return DEFAULT_CATEGORY

def get_pricing(license_key, readme_content):
    """Determine pricing based on license and README."""
    if license_key in ["mit", "apache-2.0", "gpl-3.0", "bsd-3-clause"]:
        return "Open Source"
    
    readme_lower = readme_content.lower() if readme_content else ""
    if "pricing" in readme_lower or "subscription" in readme_lower or "paid" in readme_lower:
        if "free tier" in readme_lower or "community edition" in readme_lower:
            return "Freemium"
        return "Paid"
        
    return "Check Repo"

def fetch_github_repos(query, limit=50):
    url = f"https://api.github.com/search/repositories?q={query}&sort=stars&order=desc&per_page={limit}"
    try:
        print(f"Fetching GitHub repos for query: {query}...")
        resp = requests.get(url, headers=HEADERS)
        if resp.status_code == 200:
            return resp.json().get("items", [])
        elif resp.status_code == 403:
            print("GitHub Rate Limit Exceeded. Using cached data if available.")
            return []
        else:
            print(f"Error fetching GitHub data: {resp.status_code}")
            return []
    except Exception as e:
        print(f"Exception fetching GitHub data: {e}")
        return []

def main():
    print("Starting AI Tools Sync...")
    
    all_tools = []
    
    # 1. Add Static Tools
    print(f"Adding {len(STATIC_TOOLS)} static tools...")
    all_tools.extend(STATIC_TOOLS)
    
    # 2. Fetch GitHub Data
    # Searching for general AI tools and specifically LLMs
    repos = fetch_github_repos("topic:ai-tool")
    repos.extend(fetch_github_repos("topic:llm"))
    repos.extend(fetch_github_repos("topic:generative-ai"))
    
    # Deduplicate by ID
    seen_ids = set()
    unique_repos = []
    for repo in repos:
        if repo["id"] not in seen_ids:
            seen_ids.add(repo["id"])
            unique_repos.append(repo)
    
    print(f"Processing {len(unique_repos)} GitHub repositories...")
    
    for repo in unique_repos:
        # Skip if already in static list (by name rough match)
        if any(t["name"].lower() == repo["name"].lower() for t in STATIC_TOOLS):
            continue
            
        topics = repo.get("topics", [])
        category = get_category(repo["name"], repo["description"], topics)
        
        # Simple pricing detection (without fetching README to save API calls for now)
        license_info = repo.get("license")
        license_key = license_info["key"] if license_info else None
        pricing = "Open Source" if license_key in ["mit", "apache-2.0", "agpl-3.0"] else "Check Repo"
        
        tool = {
            "name": repo["name"],
            "description": repo["description"] or "No description provided.",
            "url": repo["html_url"],
            "category": category,
            "pricing": pricing,
            "stars": repo["stargazers_count"],
            "forks": repo["forks_count"],
            "updated_at": repo["updated_at"],
            "source": "github"
        }
        all_tools.append(tool)
        
    # 3. Sort by 'Stars' (Popularity)
    all_tools.sort(key=lambda x: x.get("stars", 0), reverse=True)
    
    # 4. Save to JSON
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_tools, f, indent=2)
        
    print(f"Successfully saved {len(all_tools)} tools to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
