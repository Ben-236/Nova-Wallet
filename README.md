# Nova Wallet Service

## Overview
Simple NestJS wallet service supporting:
- Wallet creation
- Funding
- Transfers
- Fetching wallet details with transaction history

## Tech Stack
- NestJS
- TypeScript
- In-memory storage (Map)

## Endpoints

### Create Wallet
`POST /wallets`
Body: `{ "currency": "USD" }`

### Fund Wallet
`POST /wallets/:id/fund`
Body: `{ "amount": 100 }`

### Transfer Funds
`POST /wallets/transfer`
Body: `{ "fromId": "...", "toId": "...", "amount": 50 }`

### Get Wallet Details
`GET /wallets/:id`

## Testing
Basic unit tests are included using Jest:
- Service instantiation
- Controller instantiation
- Endpoint coverage (fund/transfer/create)

Run API locally:
```bash
npm run start:dev    

Run tests:
```bash
npm run test
