import time
import subprocess
import sys
import os

def run_scraper():
    print("Running daily scraper...")
    scraper_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scraper.py")
    try:
        # Use sys.executable to ensure we use the same python env
        subprocess.run([sys.executable, scraper_path], check=True)
        print("Scraper finished successfully.")
    except Exception as e:
        print(f"Scraper failed: {e}")

if __name__ == "__main__":
    print("Daily Scheduler started...")
    # Run once immediately on startup
    run_scraper()

    while True:
        print("Sleeping for 24 hours...")
        time.sleep(24 * 60 * 60)
        run_scraper()
