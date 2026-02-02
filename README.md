# Online-Games-MERN (Backend additions)

This repository contains a frontend (`/client`) and a backend (`/server`). I added a realistic backend skeleton for an online gaming agent + affiliate system: wallet ledger, commission engine, role-based auth, dashboards, and a seed script.

Quick start (server):

1. Install dependencies from `/server`:

```bash
cd server
npm install
```

2. Copy `.env.example` to `.env` and adjust values.

3. Seed example data:

```bash
npm run seed
```

4. Start server:

```bash
npm run dev
```

Highlights:
- Ledger-based wallet entries (`WalletLedger`) for every balance change
- Commission engine in `services/commissionService.js` (uses MongoDB transactions)
- RBAC middleware and JWT auth stubs
- Seed script creates 1 agent, 1 affiliate, 5 players, gameplay history, and processes commissions

Notes on financial logic:
- Commissions are created only once per gameplay by using `Commission` unique index on `referenceId`+`ownerId`.
- Wallet adjustments always create a `WalletLedger` entry and are performed inside MongoDB transactions to keep balances consistent.
- All money math is done in backend; frontend should not compute balances.

<img width="1919" height="1015" alt="2" src="https://github.com/user-attachments/assets/f9b8c461-7a28-4f2a-8e75-893a229950b2" />
<img width="1919" height="1005" alt="1" src="https://github.com/user-attachments/assets/4f559fc4-ff6b-4d6e-a954-9405d476c628" />

