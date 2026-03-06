#!/usr/bin/env python3
"""Simple screenshot tool using Selenium"""

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    import time
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    
    # Create driver
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Navigate to the page
        print("Navigating to http://localhost:5173/...")
        driver.get('http://localhost:5173/')
        
        # Wait for page to load
        time.sleep(2)
        
        # Get page height for full screenshot
        total_height = driver.execute_script("return document.body.scrollHeight")
        driver.set_window_size(1920, total_height)
        
        # Take screenshot
        print("Taking screenshot...")
        driver.save_screenshot('screenshot.png')
        print("✓ Screenshot saved to screenshot.png")
        
    finally:
        driver.quit()
        
except ImportError:
    print("❌ Selenium is not installed.")
    print("Please install it with: pip3 install selenium")
    print("\nAlternatively, you can:")
    print("1. Open http://localhost:5173/ in your browser")
    print("2. Take a screenshot manually")
