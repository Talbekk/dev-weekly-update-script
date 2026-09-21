# dev-weekly-update-script

A TypeScript CLI script that queries the [Shortcut](https://shortcut.com) API and prints a weekly development metrics summary to stdout. It reports on the previous calendar week (Monday–Sunday) for the Product and Development teams.

## Metrics Reported

**Completed last week**

- **Stories Cleared** and **Points Cleared**
- **Bugs Cleared**
- **Chores Cleared** (story count and points)
- **AI Completed Stories**: stories carrying the AI label, listed by name
- **Epic Stories Cleared** and **Epic Points Cleared**: completed stories linked to an epic
- **Epics Completed**: epics completed within the week

**Current snapshot**

- **Active Epics**: epics that are not completed or archived, have started, have at least one owner, and belong to the Development group
- **Open Bugs**: unstarted, non-archived bugs not linked to an epic, with a breakdown of:
  - **Highest Priority Bugs**
  - **High Priority Bugs**
  - **Combined Priority Bugs** (Highest + High)
  - **Support Bugs** (bugs with an external support link)

## Prerequisites

- Node.js 20 or higher
- A Shortcut account with API access
- A Shortcut API token

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

- `SHORTCUT_API_TOKEN`: Your Shortcut API token

### Getting Your API Token

1. Log in to your Shortcut account
2. Go to Settings → Account → API Tokens (https://app.shortcut.com/settings/account/api-tokens)
3. Generate a new API token
4. Copy the token and paste it into your `.env` file

### Hardcoded Configuration

The following are not configurable through environment variables:

- **Groups**: the Product and Development team UUIDs live in [data/groups/index.ts](data/groups/index.ts). Stories and bugs are limited to these two groups.
- **Priority custom fields**: the Highest/High priority custom field IDs live in [constants.ts](constants.ts).
- **Date range**: always the previous Monday–Sunday week, calculated in [helpers/getPreviousWeekDateRange/index.ts](helpers/getPreviousWeekDateRange/index.ts).

## Usage

```bash
npm start
```

## Example Output

```
🚀 Shortcut Weekly Update Script

📅 Report for the week: Mon Sep 14 2026 - Sun Sep 20 2026

📊 Total completed stories: 24
📊 Total completed story points: 58
📊 Total bugs cleared: 6

📊 Total stories completed by AI: 2
- Add retry logic to webhook handler - Completed at: 2026-09-16T10:12:44Z
- Migrate settings form to new validation - Completed at: 2026-09-17T14:03:10Z

📊 Total epic stories completed: 9
📊 Total epic points completed: 21
- Onboarding revamp step 1 (Epic ID: 1234) - Completed at: 2026-09-15T09:30:00Z
...

📊 Total completed epics: 1
- Onboarding revamp

📊 Total active epics: 3
- Billing improvements
- Reporting dashboard
- Search performance

📊 Total open bugs: 18
📊 Highest priority bugs: 1
📊 High priority bugs: 4
📊 Combined priority bugs: 5
📊 Support bugs: 3

📊 Total chores completed: 5
📊 Total chore points completed: 8

✅ Report generated successfully!
```

## Development

```bash
npm test           # Run tests once (vitest run)
npm run test:watch # Run tests in watch mode
npm run typecheck  # TypeScript type checking (tsc --noEmit)
```

### Project Structure

Feature modules follow a `<domain>/<function>/index.ts` layout with a co-located `index.test.ts`.

- `index.ts`: entry point; validates config, builds the report, and displays it
- `api/`: axios client for `https://api.app.shortcut.com/api/v3`, passed into every fetch module
- `report/buildWeeklyReport`: fetches epics, bugs, and completed stories in parallel and assembles the `WeeklyReport`
- `report/displayReport`: prints the report to stdout
- `stories/`, `epics/`, `bugs/`, `groups/`, `workflows/`, `customFields/`: fetchers and metric calculations for each domain
- `helpers/`: date range and API error handling helpers
- `mocks/shortcut.ts`: shared test fixtures

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
