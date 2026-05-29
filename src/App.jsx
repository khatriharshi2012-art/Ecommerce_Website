import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar2 from "./Components/Navbar2";
import Everything from "./pages/Everything";
import Women from "./pages/Women";
import Men from "./pages/Men";
import ProductDetails from "./pages/ProductDetails";
import Footer from "./Components/Footer";
import Kids from "./pages/Kids";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import PlaceOrder from "./pages/PlaceOrder";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Navbar from "./Components/Navbar";
import Wishlist from "./pages/Wishlist";
import ProtectedRoute from "./Components/ProtectedRoute";
import ScrollManager from "./Components/ScrollManager";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Navbar2 />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/" element={<Navbar />}>
            <Route path="/everything" element={<Everything />} />
            <Route path="/women" element={<Women />} />
            <Route path="/men" element={<Men />} />
            <Route path="/kids" element={<Kids />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute message="Please login first to view your cart.">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute message="Please login first to continue to checkout.">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/place-order"
              element={
                <ProtectedRoute message="Please login first to place your order.">
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute message="Please login first to view your order details.">
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute message="Please login first to view your orders.">
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-tracking/:id"
              element={
                <ProtectedRoute message="Please login first to track your order.">
                  <OrderTracking />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute message="Please login first to view your wishlist.">
                  <Wishlist />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
