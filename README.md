# 💪 PT Manager

A mobile-first PWA for freelance personal trainers to manage clients, contracts, scheduling, and progress tracking.

> **Demo credentials:** `pt@example.com` / `123`

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18+ | UI framework |
| TypeScript | 5+ | Type safety |
| Vite | 5+ | Build tool |
| React Router | v6 | Client-side routing |
| Tailwind CSS | 3+ | Styling |
| Axios | 1+ | HTTP client (ready for backend) |
| vite-plugin-pwa | - | PWA manifest + service worker |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # AppShell, TopBar, BottomNav, PageWrapper
│   └── ui/              # Icon, Badge, Avatar, Card, Btn, Input, Textarea, Select
├── context/
│   └── AppContext.tsx    # useReducer global state + localStorage persistence
├── data/
│   └── mockData.ts       # Mock PT profile, clients, notifications
├── hooks/
│   ├── useAuth.ts        # login / logout
│   └── useClients.ts     # all client operations (add, update, sessions, progress)
├── lib/
│   ├── api.ts            # Axios instance (pre-wired for future backend)
│   ├── dateUtils.ts      # fmtDate, addDays, getMonthCells, etc.
│   └── storage.ts        # localStorage helpers
├── pages/
│   ├── auth/             # LoginPage
│   ├── calendar/         # CalendarPage
│   ├── clients/          # ClientsListPage, ClientDetailPage, CreateContractPage
│   ├── contracts/        # ContractsPage
│   ├── dashboard/        # DashboardPage
│   ├── portal/           # ClientPortalPage (public, no auth)
│   └── reports/          # ReportsPage
├── router/
│   └── index.tsx         # React Router v6 routes + PrivateRoute guard
├── types/
│   └── index.ts          # All TypeScript interfaces & types
├── App.tsx
├── main.tsx
└── index.css
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Type-check
npm run type-check

# 4. Build for production
npm run build
```

---

## Routes

| Route | Page | Auth |
|---|---|---|
| `/login` | LoginPage | Public |
| `/dashboard` | Dashboard | ✅ PT only |
| `/clients` | Clients list | ✅ PT only |
| `/clients/new` | Create contract (3-step) | ✅ PT only |
| `/clients/:id` | Client detail (4 tabs) | ✅ PT only |
| `/calendar` | Global calendar | ✅ PT only |
| `/contracts` | Contracts list | ✅ PT only |
| `/reports` | Reports & charts | ✅ PT only |
| `/client/:id` | Client portal | 🌐 Public |

---

## Adding a Real Backend

The `src/lib/api.ts` file contains a pre-configured Axios instance. When you're ready:

1. Set `VITE_API_URL` in a `.env` file:
   ```
   VITE_API_URL=https://your-api.com/api
   ```
2. Replace `dispatch` calls in `useClients.ts` / `useAuth.ts` with `api.get/post/put` calls.
3. Store the JWT from your auth endpoint in `localStorage` under `pt_token` — the Axios interceptor will attach it automatically.

---

## Next phase

```bash
Show demo
Collect feedbacks
Prepare BE (still not sure about the database)
...
```
