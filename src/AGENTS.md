# Project

Smart Campus is a room availability checker that uses fictional data.
`src/App.tsx` currently contains the availability rules, sample rooms,
sample bookings, and the UI.

# Acceptance criteria

- AC1: Reject requests in the past and intervals where start is at or after end.
- AC2: Reject requests longer than 120 minutes.
- AC3: Reject requests for blocked rooms.
- AC4: Reject overlapping bookings and allow intervals that only touch at an endpoint.
- AC5: Availability checks must not modify the booking fixtures.
- AC6: Availability feedback must remain clear on desktop and narrow mobile screens.

# Refactoring scope

Choose one concrete maintainability problem and make the smallest change
that addresses it. Prefer a pure function that can be tested directly.
Use at most two patterns and justify each one.

Preserve the current room list, time input, booking fixtures, and UI
behavior. Do not add login, a backend, a database, or booking creation.

# Verification

Existing checks: `npm run typecheck`, `npm run lint`, and `npm run build`.
The initial project has no test script.

Add focused regression tests for past time, reversed intervals,
121-minute duration, blocked rooms, overlapping bookings, touching
endpoints, and unchanged fixtures. Report the exact test command and
pass/fail counts. Compare desktop and mobile feedback before and after.