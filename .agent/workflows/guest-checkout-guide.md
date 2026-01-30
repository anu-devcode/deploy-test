---
description: Adis Harvest Guest Checkout & Tracking Guide
---

# Guest Checkout & Order Tracking

This workflow documents the hybrid guest-to-member checkout system implemented for Adis Harvest.

## Overview
The system allows users to checkout without an account (Guest) or as a logged-in Member.
- **Guests**: Orders are tracked via `guestEmail` and `orderNumber`. No dashboard access.
- **Members**: Orders are linked to `customerId` and appear in the dashboard.

## Key Components

### 1. Checkout Flow (`/checkout`)
The checkout process now includes an **Account Step**:
- **Member**: If logged in, automatically skips to Shipping.
- **Guest**: Can choose to "Sign In" or "Continue as Guest".
- **Payload**: Guest orders include `isGuest: true` and `guestEmail`.

### 2. Order Tracking (`/track-order`)
A public page where guests can track their orders.
- Requires **Order Number** (e.g., `AH-7K9...`) and **Email**.
- Calls `GET /orders/track/email`.
- Displays status, items, and shipping info.

### 3. Backend Logic (`OrdersService`)
- Validates that either `customerId` OR `guestEmail` is present.
- Generates a unique `trackingToken` for guest orders (future-proof for direct links).
- Public endpoints exposed in `OrdersController` for creation and tracking.

## Development Rules
- **Do NOT** enforce `customerId` on the `Order` model (it is optional).
- **Do NOT** protect the `POST /orders` endpoint (it must be public for guests).
- **Do NOT** protect `GET /orders/track/...` endpoints.

## Testing
1. Go to `/checkout`.
2. Select "Continue as Guest".
3. Complete checkout.
4. Copy the Order Number from the success page.
5. Go to `/track-order` and enter the number + email.
