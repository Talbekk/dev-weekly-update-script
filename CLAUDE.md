# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- `groups/fetchGroups` — fetches all Shortcut groups via `GET /groups`
- `epics/fetchEpics` — fetches all epics via `GET /epics`, then filters to those completed within the date range
- `stories/fetchCompletedStories` — searches completed stories via `POST /stories/search` with a date range, computes metrics (points, bugs, epic-linked stories)
- `epics/displayEpics` — formats and prints epic data to stdout

**Hardcoded group data:** `data/groups/index.ts` contains static group objects (Product and Development teams) with real Shortcut UUIDs. `fetchCompletedStories` uses these IDs to filter stories to just those two teams.

**Date range helper:** `helpers/getPreviousWeekDateRange` returns the Monday–Sunday range for the previous calendar week.

**Types:** `types.ts` defines `ApiClient`, `DateRange`, `Epic`, `Story`, and `Group`. Note: the `Story` type is incomplete — `mocks/shortcut.ts` includes additional fields (`completed`, `completed_at`, `label_names`, etc.) that aren't yet in the type definition.

**Tests:** Each feature module has a co-located `index.test.ts` using Vitest. The pattern is to create a mock client with `vi.fn()` and pass in data from `mocks/shortcut.ts`.

## Planned Features (from README)

Still to be implemented: active epic counts, bug priority breakdown.
