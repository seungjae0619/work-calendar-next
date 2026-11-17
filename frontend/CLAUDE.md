# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A shift-schedule calendar app (지하철 근무표) for subway shift workers. It shows a monthly calendar of work types (주 day / 야 night / 휴 off), lets logged-in users change a day's work type, and counts substitute holidays (대체휴무) for the month. The UI text is Korean.

All app code lives in `frontend/` (the repo root holds only this folder). Run every command from `frontend/`.

## Commands

```bash
npm run dev            # next dev on 0.0.0.0:3000 (reachable from phones on the LAN)
npm run build
npm run lint           # eslint (flat config: next core-web-vitals + typescript)
npm run test:e2e       # Playwright e2e (e2e/), starts `npm run dev` itself
npx playwright test e2e/edit-shift.spec.ts   # single file
```

There are no unit tests; the only tests are Playwright e2e tests. They run against the **real Supabase project** (no mocks), with the browser timezone fixed to `Asia/Seoul`. `e2e/edit-shift.spec.ts` changes a real `shift` row (the 15th of the current month) and restores the original value in `afterAll`. It is skipped unless `E2E_EMAIL` and `E2E_PASSWORD` are set. `playwright.config.ts` loads `.env.local` via `@next/env`.

Supabase needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (in `.env.local`).

## Architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind v4. Path alias `@/*` maps to the `frontend/` root (configured in both `tsconfig.json` and `jest.config.ts`).

**Auth / Supabase**
- `middleware.ts` refreshes the Supabase session cookie on every request.
- `app/page.tsx` is a server component: it reads the user with `authServerService` (`lib/supabase/server.ts`, cookie-based) and passes `user` down as a prop.
- `features/calendar/Calendar.tsx` copies that prop into the Zustand `store/user.ts`, which client components read to gate editing.
- Client-side login and logout use the browser client singleton (`lib/supabase/client.ts`); after either, `router.refresh()` re-runs the server component to pick up the new user.

**Data flow (shift table)**
- `lib/api/shift.ts`: `getShift(start, end)` reads rows from the Supabase `shift` table by date range. `updateShift` checks for a session, updates `changed_work_type` for a date with `.select()`, and throws if 0 rows changed (Supabase returns no error when RLS blocks an update).
- Row shape (`types/shift.ts`): `date`, `work_type` (the base schedule), `changed_work_type` (the user's override, nullable).
- `hooks/useShift.ts` is a TanStack Query wrapper keyed `["shift", start, end]`. `hooks/useEditShift.ts` invalidates `["shift"]` on success.
- `utils/eventFilter.ts#toCalendarEvents` turns rows into FullCalendar events: the title is the override or the base type, `extendedProps.isChanged` marks overrides (shown as a red dot), and rows outside the displayed month are dropped.

**Month carousel (the core UI)**
- `features/calendar/hooks/useCalendarLogic.ts#useMonthCarousel` keeps a `centerDate` and renders three `MonthPanel`s (prev, center, next) inside a framer-motion draggable strip (`ShiftCalendar.tsx`).
- A drag past the distance or velocity threshold animates one panel width, then resets `x` to the base position and shifts `centerDate`. Panels are keyed by date, so neighbouring months are already mounted while swiping.
- Each `MonthPanel` is its own `<FullCalendar>` and calls `useShift` for its own month, so adjacent months are prefetched.
- `Calendar.tsx` works out the displayed year/month and query range directly from `centerDate`. It uses them for the header and for the substitute-holiday count. Always build the range with `utils/dateHelpers.ts#getMonthQueryRange`, so `Calendar` and the center `MonthPanel` share one query-cache entry.
- Day-cell, holiday and event rendering is in `CalendarRenderer.tsx`. Work-type colours are in `features/calendar/constants.ts` (`WORK_TYPES`).
- Clicking an event opens `features/dialog/Dialog.tsx`, which shows the work-type toggle group and calls `useEditShift`.

**UI primitives**: shadcn-style Radix wrappers live in `components/ui/`, and every import uses `@/components/ui/...`. `features/ui/` is an identical, unused copy.

## Gotchas

- **Timezone**: dates are formatted with `toISOString().split("T")[0]`, which is UTC. In KST (UTC+9), `new Date(y, m, 1)` formats as the last day of the previous month, so the query range starts one day early. `toCalendarEvents` filters by `YYYY-MM` again to drop that day. Keep this in mind when touching date-range code.
- **Holidays**: `@hyunbinseo/holidays-kr` only has data for 2018–2026 and throws a `RangeError` for other years. Always call it through `utils/holidays.ts` (`safeIsHoliday`, `safeGetHolidayNames`), never directly.
