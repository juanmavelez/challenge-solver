# Challenge Solver AI

A powerful Chrome extension that integrates AI assistance directly into your coding challenge workflow. This tool sends LeetCode problem descriptions to an AI model and displays the solution right on the page, helping you learn and solve problems faster.

## Features

- **seamless Integration**: Adds a "⚡ Solve with AI" button directly to the LeetCode problem interface.
- **AI-Powered**: Uses Google's **Gemini 1.5 Flash** model (configurable API key) to generate high-quality code solutions.
- **Instant Solutions**: Displays the solution in a clean, copy-friendly panel without leaving the tab.
- **Secure**: Your API key is stored locally in your browser and never shared.

## Installation

Since this is a developer extension, you'll need to install it manually in Chrome:

1.  **Clone or Download** this repository to your local machine.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** by toggling the switch in the top-right corner.
4.  Click the **Load unpacked** button.
5.  Select the folder containing this project (the folder with `manifest.json`).

## Setup

### 2. Configure API Key

1.  Click the extension icon in your Chrome toolbar.
2.  Enter your **Google Gemini API Key**.
    - You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Click **Save Settings**.

## Usage

1.  Navigate to any [LeetCode](https://leetcode.com/) problem page.
2.  Look for the **⚡ Solve with AI** button (usually near the "Submit" or "Run" buttons).
3.  Click the button. The AI will analyze the problem and generate a solution.
4.  The solution will appear in a panel on the right side of the screen.

## Project Structure

- `manifest.json`: Configuration for the Chrome extension (permissions, scripts, etc.).
- `scripts/`: Contains the logic for the extension.
    - `background.js`: Handles API requests to OpenAI to keep your key secure and avoid CORS issues.
    - `content.js`: Interacts with the webpage, scrapes the problem description, and injects the UI.
- `popup/`: The user interface for the extension popup (API key settings).
- `styles/`: CSS files for styling the injected elements.

## Technologies Used

- JavaScript (ES6+)
- Chrome Extension Manifest V3
- OpenAI API
