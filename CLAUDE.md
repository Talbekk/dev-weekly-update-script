# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

Project uses TypeScript as the primary language; prefer typed implementations and keep JSON config consistent with existing patterns.


## Commands

```bash
npm start          # Run the script (tsx index.ts)
npm test           # Run tests once (vitest run)
npm run test:watch # Run tests in watch mode
npm run typecheck  # TypeScript type checking (tsc --noEmit)
```

To run a single test file:
```bash
npx vitest run stories/fetchCompletedStories/index.test.ts
```

## Environment Setup

Copy `.env.example` to `.env` and set `SHORTCUT_API_TOKEN`. The token is fetched from Shortcut account settings. Optional vars: `DAYS_BACK`, `PAGE_SIZE`, `WORKFLOW_STATE_IDS`.

## Architecture

This is a CLI script that queries the [Shortcut](https://shortcut.com) project management API and prints a weekly metrics summary to stdout.

**Entry point:** `index.ts` — orchestrates the flow: create API client → fetch groups/epics/stories → display results.

**API client:** `api/index.ts` creates an axios instance pointed at `https://api.app.shortcut.com/api/v3` with the `Shortcut-Token` header. All feature modules receive this client as a parameter rather than importing it directly.

**Feature modules** follow a consistent pattern at `<domain>/fetch<Domain>/index.ts`:
- `api/index.ts` — creates the axios client (`createApiClient`); all feature modules receive it as a parameter
- `groups/fetchGroups` — fetches all Shortcut groups via `GET /groups`
- `epics/fetchEpics` — fetches all epics via `GET /epics`, filters to those completed within the date range
- `epics/displayEpics` — formats and prints epic data to stdout
- `stories/fetchCompletedStories` — searches completed stories via `POST /stories/search` with a date range and group IDs, computes metrics (points, bugs, AI-labelled stories, epic-linked stories)
- `workflows/getWorkflows` — fetches all workflows via `GET /workflows`

**Active epic filtering:** `index.ts` filters epics to those that are not completed, not archived, started, have at least one owner, and belong to the Development group (`group_ids` includes the Development UUID).

**Hardcoded group data:** `data/groups/index.ts` contains static `Group` objects (Product and Development teams) with real Shortcut UUIDs. `fetchCompletedStories` sends both group IDs in the `group_ids` search param to limit results to those two teams.

**Date range helper:** `helpers/getPreviousWeekDateRange` returns the Monday–Sunday range for the previous calendar week.

**Types:** `types.ts` defines `ApiClient`, `DateRange`, `Epic`, `Story`, `Group`, `Workflow`, and `WorkflowState`.

**Tests:** Every module has a co-located `index.test.ts` using Vitest. The standard pattern:
- Create a mock client with `vi.fn()` (e.g. `{ get: vi.fn().mockResolvedValue({ data }) }`)
- Pass in fixture data from `mocks/shortcut.ts` (`mockEpics`, `mockStories`, `mockGroups`, `mockWorkflows`)
- For `api/index.ts`, mock axios itself with `vi.mock("axios", ...)`
- Silence `console.log` in `beforeEach` with `vi.spyOn(console, "log").mockImplementation(() => {})`

## Planned Features (from README)

Still to be implemented: active epic counts, bug priority breakdown.
