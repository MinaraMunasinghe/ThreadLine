# ThreadLine

Type-safe enterprise clothing e-commerce and inventory dashboard built with the MEAN stack (MongoDB, Express, Angular, Node.js) and Tailwind CSS.

## Project structure

```
ThreadLine/
├── backend/     # Express + TypeScript + Mongoose API
└── frontend/    # Angular 21 + Tailwind CSS SPA
```

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (connection string)
- PayHere Sandbox merchant credentials (optional for local hash testing)

## Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI, ADMIN_API_KEY, PayHere credentials
npm install
npm run seed    # optional: load sample products
npm run dev
```

API runs at `http://localhost:5000`.

### Key endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products (`?category=Men`) |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create (header: `x-admin-key`) |
| PUT | `/api/products/:id` | Update (admin) |
| DELETE | `/api/products/:id` | Delete (admin) |
| POST | `/api/payments/checkout` | Create order + PayHere hash payload |
| POST | `/api/payments/notify` | PayHere webhook |

## Frontend setup

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:4200`.

Set `adminApiKey` in `src/environments/environment.ts` to match `ADMIN_API_KEY` in the backend `.env`.

## PayHere checkout flow

1. Customer fills checkout form (optional separate delivery address).
2. Frontend POSTs cart + billing/delivery details to `/api/payments/checkout`.
3. Backend saves a `Pending` order, computes MD5 hash per PayHere spec, returns payload.
4. Frontend injects a hidden form and POSTs to `https://sandbox.payhere.lk/pay/checkout`.

## Type alignment

Shared domain types live in:

- `backend/src/types/product.ts` & `order.ts`
- `frontend/src/app/core/models/product.ts` & `order.ts`

Keep these in sync when extending schemas.

## 🚀 Upcoming Development
* **Payment Gateway Integration:** The architecture for credit/debit card processing is currently being integrated via PayHere to provide a secure and seamless checkout experience for users.
