# Jobsity Calendar Challenge

A Vue 3 + Vite calendar application built for the Jobsity front-end challenge. The UI lets users browse months, manage daily reminders, and view quick weather snapshots for each event. Tailwind handles styling, Pinia manages state, and Storybook documents components with live scenarios.

**Live demo:** [jobsity-frontend-challenge-mu.vercel.app](https://jobsity-frontend-challenge-mu.vercel.app/)

## Features

- Create reminders by date/time with city entry and 30-character limit
- Visual calendar shows reminders in chronological order per day
- Reminder color picker with calendar badges matching the chosen color
- Edit reminders (title, city, day, time, color) and delete them individually or in bulk per day
- Mocked weather forecast per reminder using city + time metadata
- Unit tests covering reminder creation limits and validation logic

### Bonus Features

- Month navigation allows browsing previous/next months
- Reminder list gracefully handles multiple entries in a single day cell
- Context menu option removes all reminders for the selected day

### Extra Enhancements

- Storybook documentation with multiple calendar scenarios and interactive notes
- VeeValidate + Yup form schema preventing past-dated reminders and enforcing input rules
- Global modal system with accessible keyboard shortcuts and stacked layering
- Tailwind-powered theming with Today highlighting, weekend accents, and adjacent-month date display

## Getting Started

```bash
npm install
```
## NPM Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check (`vue-tsc`) then bundle for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` / `npm run test -- --run` | Execute Vitest unit suites |
| `npm run storybook` | Launch Storybook on port 6006 (uses Vite builder) |
| `npm run build-storybook` | Generate the static Storybook bundle |

## Architecture Decisions

- **State in Pinia**: Reminders and weather metadata live in a single Pinia store (`src/stores/reminders.ts`) so components stay presentation-focused.
- **Calendar helpers**: Date math and formatting sit in `src/utils/calendar.ts`, while UI is composed from `CalendarGrid`, `CalendarHeader`, `CalendarWeekRow`, and `CalendarContextMenu` for readability and reuse.
- **Global modal system**: `useModal` + `ModalHost` provide stackable, keyboard-friendly dialogs used by reminder and weather modals across the app.
- **Validation strategy**: VeeValidate + Yup enforce shared rules (text length, future-only scheduling, required city) before store mutations.
- **Weather abstraction**: `src/services/weather.ts` isolates the mocked forecast logic so real APIs can slot in without touching component code.
- **Storybook parity**: Stories seed a Pinia instance and reuse Tailwind styles, making Storybook the reference for component behavior/states.

## Key Folders

- `src/components/Calendar/` – Calendar grid, header, week row, and context menu
- `src/components/modals/` – Global modal host, base modal shell, reminder and weather modals
- `src/stores/reminders.ts` – Pinia store with reminder CRUD + weather fetch integration
- `src/stories/` – Storybook stories, including the documented Calendar playground

## Storybook Notes

The calendar documentation lives under **Components › Calendar** and ships with:
- **Calendar with sample agenda** – realistic month seeded with reminders
- **Empty month** – blank canvas for onboarding flows
- **Context menu demo** – highlights right-click interactions

Run `npm run storybook` to explore the stories in the browser. Storybook inherits the app’s Tailwind styling for parity with production visuals.

## Testing

Vitest is configured for Node environment tests (`npm run test -- --run`). Current coverage focuses on reminder store logic (creation, validation, deletion). Add new tests under `src/stores/__tests__/` as functionality grows.

