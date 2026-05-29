# Project Guide

## App Structure

- `src/App.jsx` defines routes and protected pages.
- `src/main.jsx` mounts global providers.
- `src/pages/` contains page-level screens.
- `src/Components/` contains reusable UI pieces like navbars and product cards.
- `src/context/` contains shared app state for auth, cart, wishlist, and notifications.
- `src/utils/` contains localStorage helpers, formatting, and order logic.
- `src/assets/` contains product data and images.

## Important Flows

### Authentication

Auth state is managed in `src/context/AuthContext.jsx`.

Stored keys:

- `user`
- `users`

Protected pages use `src/Components/ProtectedRoute.jsx` and `src/hooks/useRequireAuth.js`.

### Cart And Wishlist

Cart state is in `src/context/CartContext.jsx`.
Wishlist state is in `src/context/WishlistContext.jsx`.

Product actions are used from:

- `src/Components/ProductCard.jsx`
- `src/pages/ProductDetails.jsx`
- `src/pages/Cart.jsx`
- `src/pages/Wishlist.jsx`

### Checkout And Payment

Checkout lives in `src/pages/Checkout.jsx`.

Stored keys:

- `checkoutCustomer`
- `checkoutDraft`
- `orderHistory`
- `latestOrder`

The payment popup is a local fake payment flow for demo/testing.

### Order Tracking

Order tracking logic is centralized in `src/utils/orders.js`.

Status moves automatically by date:

- Day 0: `Order Confirmed`
- Day 1: `Packed`
- Day 2: `Shipped`
- Day 3+: `Delivered`

The tracking UI is in `src/pages/OrderTracking.jsx`.

### Ratings

Ratings appear only after delivery on the order tracking page. Submitted ratings are stored in `productReviews` and displayed in the Reviews tab on `src/pages/ProductDetails.jsx`.

## Styling

Most page styling is in `src/pages/pages.css`.
Global reset and popup styles are in `src/index.css`.
Component-specific styles are in `src/Components/components.css`.

Main app pages use balanced horizontal spacing with `clamp()` padding. The home/about/contact/catalog pages keep their existing layout.

## Popup System

Styled app popups are provided by `src/context/NotificationContext.jsx`.

Use:

```jsx
const { notify, confirm } = useNotification();
```

Examples:

```jsx
notify("Product added to cart.");
notify("Please login first.", "error");

const ok = await confirm("Remove this product?", {
  title: "Remove Product",
  confirmText: "Remove",
  tone: "danger",
});
```
