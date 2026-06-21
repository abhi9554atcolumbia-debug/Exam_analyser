# Exam Journey Tracker — Frontend

A fully responsive **frontend-only** implementation of the Exam Journey Tracker
dashboard (14 pages), built with **React + Vite + Tailwind CSS**.

This is UI only — there is no backend. All data is mock data living in
`src/data/mockData.js`, so every screen renders real-looking content out of
the box. Swap that file for real API calls whenever a backend is ready.

## Tech Stack

| Concern    | Choice               |
|------------|----------------------|
| Framework  | React 19 (Vite)      |
| Routing    | react-router-dom v6  |
| Styling    | Tailwind CSS v3      |
| Charts     | Recharts             |
| Icons      | lucide-react         |

## Pages Implemented

1. Dashboard
2. Exam History (with side detail panel)
3. Upcoming Exams
4. Analytics
5. Weakness Heatmap
6. Reflections
7. Documents
8. Goals & Plans
9. Calendar
10. Profile
11. Help Center
12. Sign Out
13. Upgrade Plan
14. Settings

## Project Structure

```
src/
├── components/
│   ├── charts/         # Recharts wrappers (line/bar/donut)
│   ├── layout/         # Sidebar, Topbar, AppLayout shell
│   └── ui/             # Reusable atoms: Card, Badge, Button, ProgressBar, StatCard
├── constants/
│   └── nav.js          # Sidebar navigation config
├── data/
│   └── mockData.js     # Single source of truth for all mock data
├── pages/               # One file per route/screen
├── App.jsx              # Route definitions
├── main.jsx             # App entry point
└── index.css            # Tailwind directives + global styles
```

## Getting Started

```bash
npm install
npm run dev       # start local dev server (http://localhost:5173)
npm run build     # production build into /dist
npm run preview   # preview the production build locally
```

## Notes for Hooking Up a Backend Later

- Replace the static exports in `src/data/mockData.js` with API calls
  (e.g. via `fetch`/`axios` inside a `useEffect` or a data-fetching library
  like React Query) — component shapes already match what's exported
  there, so most pages won't need structural changes.
- Auth/session pages (`Profile`, `Settings`, `Sign Out`) currently render
  static state; wire up real handlers once auth endpoints exist.
- The `Add Exam`, `Save Reflection`, `Upload Document`, etc. buttons are
  currently inert — hook them to your API/mutation layer when ready.

## Responsive Behavior

- Sidebar collapses on screens narrower than the `lg` breakpoint (add a
  mobile drawer trigger in `Topbar.jsx` if a hamburger menu is needed).
- All grids reflow from multi-column to single/double column on small
  screens via Tailwind's responsive utilities.
