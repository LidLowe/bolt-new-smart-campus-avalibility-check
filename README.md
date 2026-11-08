# Smart Campus Room Availability

A React and TypeScript app that checks whether a campus room is free for a requested time slot. All rooms and bookings are fictional sample data.

## Setup

Requires Node.js 18 or newer.

```bash
npm install
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the app locally with Vite |
| `npm run build` | Produces a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs all tests once with Vitest |
| `npm run typecheck` | Runs the TypeScript compiler without emitting files |
| `npm run lint` | Runs ESLint across the project |

## Current time

The app uses a fixed current time of 08:00 AM, shown as text under "Current Time". It does not read the real clock, so results are the same every time you run the app. Start times must be after 8:00 AM, and bookings can run for at most 120 minutes.

## Filtering rooms

Two filters sit above the room list. Rooms that fail either filter are hidden.

- **Headcount:** a room matches when its capacity is at least the number entered. A room with 40 seats matches a headcount of 40 but not 41. Leaving the field empty applies no capacity limit.
- **Required equipment:** a room matches only if it has every selected item. Selecting Projector and Whiteboard shows only rooms that have both.

Both filters apply together. Blocked rooms still appear in the list with a Blocked badge, but they always return UNAVAILABLE. If a filter hides the room you selected, the selection and its result are cleared.

Room list for reference:

| Room | Building | Capacity | Equipment | Status |
| --- | --- | --- | --- | --- |
| A-101 | Engineering Block | 40 | Projector, Whiteboard | Open |
| B-220 | Science Block | 25 | Projector, Lab Benches | Open |
| C-305 | Business Block | 60 | Projector, Whiteboard, Video Conferencing | Blocked |
| D-110 | Library Wing | 15 | Whiteboard | Open |
| E-402 | Arts Center | 30 | Video Conferencing | Open |

## Reproducing the 15:00 to 16:00 outcomes

Both rooms are checked for the same interval, 3:00 PM to 4:00 PM.

1. Start the app with `npm run dev` and open the page in your browser.
2. Click **B-220** in the room list.
3. Set **Start Time** to `15:00` and **End Time** to `16:00`.
4. Click **Check Availability**. The result is UNAVAILABLE, because B-220 already has "Study Group" from 3:00 PM to 4:00 PM.
5. Click **A-101** in the room list. The old result disappears.
6. Click **Check Availability** again. The result is AVAILABLE: "A-101 is available from 3:00 PM to 4:00 PM."

## Tests

`npm test` covers the availability rules, the room filters, the fixture data, and the page's behavior. The page tests run in a simulated browser environment (jsdom) using React Testing Library.
