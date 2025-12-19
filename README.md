# Nova Wallet Service

## Overview
A simple NestJS wallet service supporting:
- Wallet creation
- Funding wallets
- Transferring between wallets
- Fetching wallet details along with transaction history

Idempotency is implemented for fund and transfer operations using a unique `requestId`.

---

## Tech Stack
- Node.js
- NestJS
- TypeScript
- In-memory storage (Map)
- Jest for unit testing

---

# Setup Instructions

1. Clone the repo:

```bash
git clone https://github.com/Ben-236/Nova-Wallet



Install dependencies:

npm install


Run the project in development mode:

npm run start:dev


Run tests:

npm run test

Assumptions

In-memory storage is acceptable; no database required.

requestId is provided by the client for idempotency.

Each operation (fund/transfer) is atomic.

Transaction history is stored per wallet.

API Endpoints

