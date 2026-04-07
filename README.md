# Web3Pay — Crypto Payment Gateway Demo

A single-page merchant checkout demo built on top of the [Web3Pay](https://crypto-payment-gateway-ns8b.onrender.com) API. Shows the full customer payment flow — product page, live ETH payment screen, confirmation, and expiry — as a real-world integration example.

## Screens

| Route | Description |
|---|---|
| `/` | Product page with "Pay with ETH" button |
| `/pay/[id]` | Payment screen — QR code, deposit address, ETH amount, countdown timer, auto-polls status |
| `/pay/[id]/success` | Confirmation screen on `CONFIRMED` |
| `/pay/[id]/expired` | Expiry screen on `EXPIRED` or timer hitting zero |

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **qrcode.react** for QR generation
- Deployed on **Vercel**

## How it works

1. Clicking "Pay with ETH" calls a Next.js server route (`/api/create-payment`) which forwards the request to the gateway API using a server-side publishable key — the key is never exposed to the browser.
2. The payment screen receives the deposit address, ETH amount, and expiry via URL params and polls `GET /payments/:id/status` every 5 seconds.
3. On status change the app automatically transitions to the success or expired screen.

## Local development

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://crypto-payment-gateway-ns8b.onrender.com
PAYMENT_GATEWAY_PUBLISHABLE_KEY=pk_live_...
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy to Vercel with one click. Set the following environment variables in the Vercel dashboard:

| Variable | Visibility |
|---|---|
| `NEXT_PUBLIC_API_URL` | Public |
| `PAYMENT_GATEWAY_PUBLISHABLE_KEY` | Server-only |
