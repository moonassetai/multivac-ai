# Open Source AI Tools Dashboard

## 1. Architecture Overview

The system is designed as a modular feature within the existing Multivac AI stack.

*   **Backend (FastAPI)**:
    *   **API Layer**: New endpoints `/api/tools` and `/api/tools/categories` in `backend/server.py` expose the data to the frontend.
    *   **Data Access**: `backend/database.py` manages a SQLite database (`ai_tools.db`) storing tool metadata and historical stats.
    *   **Data Collection**: `backend/scraper.py` is a standalone script that fetches data from GitHub and Hugging Face APIs, normalizes it, and updates the database.
    *   **Scheduler**: `backend/scheduler.py` runs the scraper every 24 hours.

*   **Frontend (React)**:
    *   **Dashboard**: `src/components/AiToolsDashboard.jsx` is the main view, featuring search, filtering, and sorting.
    *   **Components**: `ToolCard.jsx` displays individual tool metrics (stars, forks, pricing).
    *   **Routing**: Integrated into `src/App.jsx` as a new view state `'ai-tools'`.

*   **Data Flow**:
    1.  `scheduler.py` triggers `scraper.py`.
    2.  `scraper.py` fetches raw JSON from GitHub/HF, applies ranking logic, and upserts to SQLite.
    3.  User opens Dashboard -> React fetches JSON from `/api/tools`.
    4.  React renders the grid of tools.

## 2. API Integration Code

See `backend/scraper.py` for the full implementation. Key logic involves:
*   **GitHub**: Searching for `topic:ai` and `topic:llm`.
*   **Hugging Face**: Fetching trending models.
*   **Heuristics**: Parsing `README.md` for pricing keywords.

## 3. Ranking Logic

The ranking score is calculated in `backend/scraper.py`:
```python
def calculate_score(stars, forks, updated_at):
    score = stars * 1.0 + forks * 2.0

    # Boost if updated recently (last 30 days)
    last_update = datetime.strptime(updated_at, "%Y-%m-%dT%H:%M:%SZ")
    if datetime.now() - last_update < timedelta(days=30):
        score *= 1.2

    return round(score, 2)
```

## 4. Database Schema

**Table: `tools`**
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PK | Unique ID |
| `name` | TEXT | Tool Name |
| `repo_url` | TEXT UNIQUE | GitHub/HF URL |
| `category` | TEXT | Mapped category (e.g., "Coding") |
| `pricing` | TEXT | "Free/Open Source", "Paid", "Freemium" |
| `stars` | INTEGER | GitHub Stars |
| `forks` | INTEGER | GitHub Forks |
| `last_updated` | TIMESTAMP | Last commit date |
| `score` | REAL | Calculated popularity score |

**Table: `daily_stats`**
*   Tracks historical stars/downloads for trending analysis.

## 5. Frontend Code

*   `src/components/AiToolsDashboard.jsx`: Main container with filters.
*   `src/components/ToolCard.jsx`: Card component with neon UI.
*   `src/App.jsx`: Routing logic.

## 6. Deployment Instructions

### Prerequisites
*   Python 3.10+
*   Node.js 16+
*   GitHub Token (optional, for higher rate limits)

### Setup
1.  **Install Backend Dependencies**:
    ```bash
    pip install -r requirements.txt
    pip install requests
    ```

2.  **Initialize Database**:
    ```bash
    python3 backend/database.py
    ```

3.  **Run Initial Scrape**:
    ```bash
    export GITHUB_TOKEN="your_token_here"
    python3 backend/scraper.py
    ```

4.  **Start Backend**:
    ```bash
    python3 backend/server.py
    ```

5.  **Start Frontend**:
    ```bash
    npm install
    npm run dev
    ```

### Automated Scraping
To ensure daily updates, run the scheduler in the background:
```bash
nohup python3 backend/scheduler.py > scraper.log 2>&1 &
```
Or add a cron job:
```bash
0 0 * * * /usr/bin/python3 /path/to/backend/scraper.py
```
