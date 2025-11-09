# Jobsity Calendar Challenge

A Vue 3 + Vite calendar application built for the Jobsity front-end challenge. The UI lets users browse months, manage daily reminders, and view quick weather snapshots for each event. Tailwind handles styling, Pinia manages state, and Storybook documents components with live scenarios.

**Live demo:** [jobsity-frontend-challenge-mu.vercel.app](https://jobsity-frontend-challenge-mu.vercel.app/)

## Tech Stack

- **Vue 3 + Vite** for the application shell
- **Pinia** to store reminders and enforce validation rules
- **Tailwind CSS** for styling and layout primitives
- **VeeValidate + Yup** for form handling inside reminder modals
- **Storybook** (Vue 3 + Vite builder) for interactive documentation
- **Vitest** for unit testing the reminder store

## Features

- Monthly calendar with weekend emphasis and Today highlight
- Right-click context menus for adding, editing, deleting reminders, and viewing weather summaries
- Mocked weather integration to surface a quick climate note for each event
- Global modal system that renders reminder and weather experiences anywhere in the app
- Storybook documentation that demonstrates common calendar states and usage tips

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
