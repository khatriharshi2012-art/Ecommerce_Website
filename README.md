# DNK Ecommerce Website

A React + Vite ecommerce storefront with catalogue browsing, cart, wishlist, checkout, order history, live order tracking, and product ratings after delivery.

## Tech Stack

- React 19
- React Router
- Vite
- Bootstrap
- LocalStorage for demo persistence

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

## Useful Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Main Features

- Product listing pages for Everything, Men, Women, and Kids
- Product details with size selection, wishlist, cart, and reviews
- Protected cart, checkout, wishlist, order history, and order tracking pages
- Fake payment modal for testing checkout
- Real-time order status based on order date
- Product rating after an order is delivered
- Styled toast and confirm popups across the app

## Notes

This project uses `localStorage`, so order and account data are stored only in the browser used for testing. Clear browser storage to reset demo data.

For a deeper project map, see [PROJECT_GUIDE.md](./PROJECT_GUIDE.md).
