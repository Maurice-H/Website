import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto('http://localhost:5173')

        # Wait a bit for initial render
        await asyncio.sleep(2)

        # Click About Me
        await page.get_by_text('About Me', exact=True).first.click()

        # Wait for transition and Discovery Path to be visible
        await page.get_by_text('Discovery Path').first.wait_for(timeout=10000)

        await page.screenshot(path='screenshot.png')
        await browser.close()

asyncio.run(main())
