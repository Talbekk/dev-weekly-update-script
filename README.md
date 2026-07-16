# dev-weekly-update-script

A simple Node.js script that communicates with the Shortcut API to fetch and display report information about stories updated within a specified time period.

## Features

- 🔐 Secure API authentication using environment variables
- 📊 Fetches stories updated within a configurable time period (default: last 7 days)
- 🎯 Optional filtering by workflow state IDs
- 📝 Displays formatted report with story details including:
  - Story ID, name, and type
  - Workflow state
  - Owners and labels
  - Last update timestamp
  - Direct link to story

## Completed Steps

- Add number for **Points Cleared** 
- Add number for **Stories Cleared**
- Add number for **Active Epics**
- Add number for **Epics Completed**
- Add number for **AI Completed Stories** with the AI tag
- Add number for **Epic Points Cleared**
- Add number for **Epic Stories Cleared**
- Add number for **Bug Count**
- Add number for **Highest Priority Bugs**
- Add number for **Medium Highest Priority Bugs**

## Todo Steps

## Prerequisites

- Node.js (version 12 or higher)
- A Shortcut account with API access
- Shortcut API token

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Talbekk/dev-weekly-update-script.git
   cd dev-weekly-update-script
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file and add your Shortcut API token:
   ```
   SHORTCUT_API_TOKEN=your_actual_token_here
   ```

## Configuration

### Required Environment Variables

- `SHORTCUT_API_TOKEN`: Your Shortcut API token (get it from https://app.shortcut.com/settings/account/api-tokens)

### Optional Environment Variables

- `DAYS_BACK`: Number of days to look back for updated stories (default: 7)
- `PAGE_SIZE`: Number of results per page (default: 25, max: 100)
- `WORKFLOW_STATE_IDS`: Comma-separated list of workflow state IDs to filter by (leave empty to fetch all states)

### Getting Your API Token

1. Log in to your Shortcut account
2. Go to Settings → Account → API Tokens (https://app.shortcut.com/settings/account/api-tokens)
3. Generate a new API token
4. Copy the token and paste it into your `.env` file

## Usage

Run the script using npm:

```bash
npm start
```

Or directly with node:

```bash
node index.js
```

## Example Output

```
🚀 Shortcut Weekly Update Script

🔍 Searching for stories updated in the last 7 days...
   Query: updated:>2024-01-19

═══════════════════════════════════════════════════════════════
📊 SHORTCUT REPORT - Stories Updated (Last 7 Days)
═══════════════════════════════════════════════════════════════

Total stories found: 15
Showing first 15 stories:

1. [FEATURE] Add user authentication
   ID: #12345
   State: 500000001
   URL: https://app.shortcut.com/story/12345
   Owners: John Doe
   Labels: backend, security
   Updated: 1/25/2024, 3:45:00 PM

2. [BUG] Fix login page redirect
   ID: #12346
   State: 500000002
   URL: https://app.shortcut.com/story/12346
   Owners: Jane Smith
   Labels: frontend, critical
   Updated: 1/24/2024, 10:30:00 AM

...

═══════════════════════════════════════════════════════════════

✅ Report generated successfully!
```

## Troubleshooting

### "SHORTCUT_API_TOKEN is not set" error

Make sure you have created a `.env` file in the project root and added your API token. The file should look like:

```
SHORTCUT_API_TOKEN=your_actual_token_here
```

### "API Error: 401" (Unauthorized)

Your API token is invalid or has expired. Generate a new token from your Shortcut account settings.

### "Network Error: No response received"

Check your internet connection and verify that you can access https://api.app.shortcut.com/

## License

ISC
