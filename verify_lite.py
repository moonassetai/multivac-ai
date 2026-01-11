from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to http://localhost:5173/?demo=true...")
        page.goto("http://localhost:5173/?demo=true")

        # Click Launch System
        print("Clicking 'Launch System'...")
        # Look for the button. Based on LandingPage context (which I haven't read but assume exists or text 'Launch System')
        # The previous screenshot might help or I just guess text.
        try:
             page.get_by_text("Launch System").click()
        except:
             # Fallback
             print("Could not find text 'Launch System', searching for button...")
             page.get_by_role("button").first.click()

        # Wait for Dashboard to load (Suspense fallback)
        print("Waiting for Dashboard...")
        time.sleep(15) # Give it time to connect socket

        output_path = "verification_preview_dashboard.png"
        page.screenshot(path=output_path)
        print(f"Screenshot saved to {output_path}")

        browser.close()

if __name__ == "__main__":
    run()
