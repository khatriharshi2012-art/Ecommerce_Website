import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { saveOrder } from "../utils/orders";
import { formatPrice, getPrimaryImage } from "../utils/format";
import { readStorage, writeStorage } from "../utils/storage";
import useRequireAuth from "../hooks/useRequireAuth";
import "./pages.css";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { user, requireAuth } = useRequireAuth();

  const shippingFee = totalPrice > 0 ? 10 : 0;
  const isCartEmpty = cartItems.length === 0;
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [editAddress, setEditAddress] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [activeStep, setActiveStep] = useState("address");
  const [saveAddress, setSaveAddress] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentStage, setPaymentStage] = useState("form");
  const [fakePayMode, setFakePayMode] = useState("upi");
  const [fakePayDetails, setFakePayDetails] = useState({
    upi: "",
    card: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [notice, setNotice] = useState(null);
  const [customerReady, setCustomerReady] = useState(false);
  const noticeTimerRef = useRef(null);
  const paymentTimerRef = useRef(null);
  const paymentOptions = [
    {
      id: "razorpay",
      label: "Razorpay",
      detail: "Pay securely with UPI, cards, and net banking",
      iconClass: "fa-solid fa-wallet",
      recommended: true,
    },
    {
      id: "stripe",
      label: "Stripe",
      detail: "Pay securely using credit or debit card",
      iconClass: "fa-regular fa-credit-card",
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      detail: "Pay when you receive your order",
      iconClass: "fa-solid fa-money-bill-wave",
    },
  ];

  const [customer, setCustomer] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const savedCustomer = readStorage("checkoutCustomer", null);
      const savedDraft = readStorage("checkoutDraft", null);
      if (savedCustomer) {
        setCustomer((prev) => ({
          ...prev,
          ...savedCustomer,
          firstName: savedCustomer.firstName || prev.firstName,
          lastName: savedCustomer.lastName || prev.lastName,
          email: savedCustomer.email || prev.email,
        }));
        setEditAddress(false);
      }

      if (savedDraft) {
        setPaymentMethod(savedDraft.paymentMethod || "razorpay");
        setCoupon(savedDraft.coupon || "");
        setDiscount(savedDraft.discount || 0);
        setActiveStep(savedDraft.activeStep || "address");
        setSaveAddress(savedDraft.saveAddress ?? true);
      }

      setCustomerReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!customerReady) {
      return;
    }

    writeStorage("checkoutCustomer", customer);
  }, [customer, customerReady]);

  useEffect(() => {
    if (!customerReady) {
      return;
    }

    writeStorage("checkoutDraft", {
      paymentMethod,
      coupon,
      discount,
      activeStep,
      saveAddress,
    });
  }, [activeStep, coupon, customerReady, discount, paymentMethod, saveAddress]);

  useEffect(() => {
    return () => {
      window.clearTimeout(noticeTimerRef.current);
      window.clearTimeout(paymentTimerRef.current);
    };
  }, []);

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(null), 2400);
  };

  const handleChange = (e) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateCustomerFields = () => {
    for (const key in customer) {
      if (!customer[key]) {
        showNotice(`Please enter ${key}.`, "error");
        return false;
      }
    }

    return true;
  };

  const applyCoupon = () => {
    if (!coupon.trim()) {
      showNotice("Please enter a coupon code first.", "error");
      return;
    }

    if (coupon === "SAVE10") {
      setDiscount(10);
      setActiveStep("review");
      showNotice("Coupon applied successfully.");
    } else {
      showNotice("Invalid coupon code.", "error");
    }
  };

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toDateString();
  };

  const finalTotal = useMemo(
    () => totalPrice + shippingFee - discount,
    [discount, shippingFee, totalPrice]
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const fullName = `${customer.firstName} ${customer.lastName}`.trim();

  const validateOrderBeforePayment = () => {
    if (!requireAuth("Please login first to place your order.")) {
      return false;
    }

    if (isCartEmpty) {
      showNotice("Your cart is empty. Add a product before placing an order.", "error");
      return false;
    }

    if (editAddress) {
      showNotice("Please save the address first.", "error");
      return false;
    }

    if (!validateCustomerFields()) {
      return false;
    }

    return true;
  };

  const completeOrder = (paymentInfo) => {
    const order = {
      id: `ORD-${Date.now()}`,
      customer,
      items: cartItems,
      paymentMethod,
      subtotal: totalPrice,
      shippingFee,
      discount,
      total: finalTotal,
      date: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      paymentStatus: paymentInfo.status,
      paymentId: paymentInfo.id,
      paymentProvider: paymentInfo.provider,
    };

    saveOrder(order);
    clearCart();
    writeStorage("checkoutDraft", {
      paymentMethod,
      coupon: "",
      discount: 0,
      activeStep: "review",
      saveAddress,
      lastPaymentId: paymentInfo.id,
    });

    paymentTimerRef.current = window.setTimeout(() => {
      setPaymentModalOpen(false);
      navigate("/order-success", { replace: true });
    }, 1400);
  };

  const handlePlaceOrder = () => {
    if (!validateOrderBeforePayment()) {
      return;
    }

    setPaymentStage("form");
    setPaymentModalOpen(true);
  };

  const handleFakePayment = () => {
    if (fakePayMode === "upi" && !fakePayDetails.upi.trim()) {
      showNotice("Please enter a UPI ID.", "error");
      return;
    }

    if (fakePayMode === "card") {
      if (
        !fakePayDetails.card.trim() ||
        !fakePayDetails.name.trim() ||
        !fakePayDetails.expiry.trim() ||
        !fakePayDetails.cvv.trim()
      ) {
        showNotice("Please fill all card details.", "error");
        return;
      }
    }

    setPaymentStage("processing");
    window.clearTimeout(paymentTimerRef.current);
    paymentTimerRef.current = window.setTimeout(() => {
      const paymentInfo = {
        status: paymentMethod === "cod" ? "Cash on Delivery" : "Paid",
        id: `pay_fake_${Date.now()}`,
        provider: paymentMethod === "cod" ? "COD" : "Fake Razorpay",
      };

      setPaymentStage("success");
      completeOrder(paymentInfo);
    }, 1700);
  };

  return (
    <div className="checkout">
      <div className="checkout-hero">
        <div>
          <h1>Checkout</h1>
          <p>Complete your order by providing your details</p>
        </div>
        <div className="secure-checkout">
          <i className="fa-solid fa-shield-halved"></i>
          <span>
            <strong>Secure Checkout</strong>
            Your data is protected
          </span>
        </div>
      </div>

      <div className="checkout-grid">
        <aside className="checkout-steps" aria-label="Checkout steps">
          {[
            ["address", "Delivery Address", "Where should we deliver?"],
            ["payment", "Payment Method", "How would you like to pay?"],
            ["shipping", "Shipping Method", "Choose your shipping option"],
            ["review", "Review & Place Order", "Confirm your order details"],
          ].map(([key, title, text], index) => (
            <button
              key={title}
              type="button"
              className={`checkout-step ${activeStep === key ? "active" : ""}`}
              onClick={() => setActiveStep(key)}
            >
              <span>{index + 1}</span>
              <div>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          ))}
        </aside>

        <main className="checkout-main">
          <section className={`checkout-panel address-panel ${activeStep === "address" ? "is-open" : "is-collapsed"}`}>
            <div className="checkout-panel-head">
              <h2>Delivery Address</h2>
              <button type="button" className="outline-green-btn" onClick={() => {
                setEditAddress(true);
                setActiveStep("address");
              }}>
                <i className="fa-solid fa-plus"></i>
                Add New Address
              </button>
            </div>

            <div className="form-row">
              <label>
                <span>First Name</span>
                <input
                  name="firstName"
                  placeholder="John"
                  value={customer.firstName}
                  onChange={handleChange}
                />
              </label>
              <label>
                <span>Last Name</span>
                <input
                  name="lastName"
                  placeholder="Doe"
                  value={customer.lastName}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Email</span>
                <input
                  name="email"
                  placeholder="john@example.com"
                  value={customer.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                <span>Phone Number</span>
                <input
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={customer.phone}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label className="checkout-field">
              <span>Street Address</span>
              <input
                name="address"
                placeholder="123 Main Street"
                value={customer.address}
                onChange={handleChange}
              />
            </label>

            <div className="form-row three">
              <label>
                <span>City</span>
                <input
                  name="city"
                  placeholder="Ahmedabad"
                  value={customer.city}
                  onChange={handleChange}
                />
              </label>
              <label>
                <span>State</span>
                <input
                  name="state"
                  placeholder="Gujarat"
                  value={customer.state}
                  onChange={handleChange}
                />
              </label>
              <label>
                <span>ZIP Code</span>
                <input
                  name="postalCode"
                  placeholder="380001"
                  value={customer.postalCode}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label className="checkout-field country-field">
              <span>Country</span>
              <input
                name="country"
                placeholder="India"
                value={customer.country}
                onChange={handleChange}
              />
            </label>

            <label className="save-check">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
              Save this address for future orders
            </label>

            <div className="checkout-panel-action">
              <button
                type="button"
                className="save-address-btn"
                onClick={() => {
                  if (!requireAuth("Please login first to continue with checkout.")) {
                    return;
                  }

                  if (isCartEmpty) {
                    showNotice("Add products to your cart before saving checkout details.", "error");
                    return;
                  }

                  if (!validateCustomerFields()) {
                    return;
                  }

                  setEditAddress(false);
                  setActiveStep("payment");
                  showNotice("Address saved successfully.");
                }}
              >
                Continue to Payment
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </section>

          <section className={`checkout-accordion ${activeStep === "payment" ? "is-open" : ""}`}>
            <button type="button" className="checkout-accordion-head" onClick={() => setActiveStep("payment")}>
              <i className="fa-solid fa-lock"></i>
              <span>
                <strong>Payment Method</strong>
                Secure payment processing
              </span>
              <i className="fa-solid fa-chevron-down"></i>
            </button>
            <div className={`payment-flex checkout-dropdown-body ${activeStep === "payment" ? "is-visible" : ""}`}>
              <p className="payment-section-label">Recommended</p>
              {paymentOptions.map((method) => (
                <label key={method.id} className={`payment-option ${paymentMethod === method.id ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  <span className="payment-option-text">
                    <strong>{method.label}</strong>
                    <small>{method.detail}</small>
                  </span>
                  <span className="payment-option-icon" aria-hidden="true">
                    <i className={method.iconClass}></i>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className={`checkout-accordion ${activeStep === "shipping" ? "is-open" : ""}`}>
            <button type="button" className="checkout-accordion-head" onClick={() => setActiveStep("shipping")}>
              <i className="fa-solid fa-truck-fast"></i>
              <span>
                <strong>Shipping Method</strong>
                Estimated Delivery: {getDeliveryDate()}
              </span>
              <i className="fa-solid fa-chevron-down"></i>
            </button>
            <div className={`shipping-choice checkout-dropdown-body ${activeStep === "shipping" ? "is-visible" : ""}`}>
              <label className="payment-option active">
                <input type="radio" checked readOnly />
                Standard Delivery - {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
              </label>
            </div>
          </section>

          <section className={`checkout-accordion ${activeStep === "review" ? "is-open" : ""}`}>
            <button type="button" className="checkout-accordion-head" onClick={() => setActiveStep("review")}>
              <i className="fa-regular fa-circle-check"></i>
              <span>
                <strong>Review & Place Order</strong>
                Review order and confirm
              </span>
              <i className="fa-solid fa-chevron-down"></i>
            </button>
            <div className={`checkout-review-box checkout-dropdown-body ${activeStep === "review" ? "is-visible" : ""}`}>
              <p><strong>{cartCount}</strong> item(s) ready for checkout</p>
              <p>Total: <strong>{formatPrice(finalTotal)}</strong></p>
            </div>
          </section>
        </main>

        <aside className="checkout-summary-card">
          <div className="checkout-summary-head">
            <h2>Order Summary</h2>
            <button type="button" onClick={() => navigate("/cart")}>Edit Cart</button>
          </div>
          <p className="checkout-item-count">{cartCount || 0} Items</p>

          <div className="checkout-items">
            {cartItems.length === 0 ? (
              <p className="muted">Your cart is empty</p>
            ) : (
              cartItems.map((item, i) => (
                <div key={item._id + item.size + i} className="checkout-summary-item">
                  <img src={getPrimaryImage(item.image)} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <small>Size: {item.size} • Qty: {item.quantity}</small>
                  </div>
                  <b>{formatPrice(item.price * item.quantity)}</b>
                </div>
              ))
            )}
          </div>

          <div className="coupon-box">
            <input
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button type="button" onClick={applyCoupon}>Apply</button>
          </div>

          <div className="summary-lines">
            <div className="summary-item">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="summary-item">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-item save-line">
                <span>Discount</span>
                <span>- {formatPrice(discount)}</span>
              </div>
            )}
            <div className="summary-item total">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {!editAddress && (
            <div className="address-summary">
              <div className="address-header">
                <h3>Delivery Address</h3>
                <button onClick={() => setEditAddress(true)} className="edit-btn">
                  Edit
                </button>
              </div>
              <p><strong>{fullName}</strong></p>
              <p>{customer.address}</p>
              <p>{customer.city}, {customer.state} - {customer.postalCode}</p>
              <p>{customer.country}</p>
              <p>{customer.phone}</p>
            </div>
          )}

          {discount > 0 && (
            <p className="saving-note">
              <i className="fa-solid fa-tag"></i>
              You're saving {formatPrice(discount)} on this order!
            </p>
          )}

          <div className="returns-note">
            <i className="fa-regular fa-circle-check"></i>
            <span>
              <strong>30-Day Easy Returns</strong>
              Change your mind? No problem.
            </span>
          </div>

          <button
            className={`place-order-btn ${isCartEmpty ? "button-disabled" : ""}`}
            onClick={handlePlaceOrder}
          >
            <i className="fa-solid fa-lock"></i>
            {paymentMethod === "cod" ? "Confirm Order" : "Pay Securely"}
          </button>
          <small className="terms-note">
            By placing your order, you agree to our Terms & Conditions and Privacy Policy.
          </small>
        </aside>
      </div>

      {paymentModalOpen && (
        <div className="fakepay-backdrop" role="dialog" aria-modal="true" aria-label="Fake Razorpay payment">
          <div className={`fakepay-modal ${paymentStage}`}>
            {paymentStage === "form" && (
              <>
                <div className="fakepay-head">
                  <div>
                    <span className="fakepay-logo">R</span>
                    <div>
                      <strong>Razorpay Secure Checkout</strong>
                      <small>Frontend demo payment gateway</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Close payment"
                    onClick={() => setPaymentModalOpen(false)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className="fakepay-merchant">
                  <span>StyleStore</span>
                  <strong>{formatPrice(finalTotal)}</strong>
                </div>

                <div className="fakepay-methods">
                  {[
                    ["upi", "UPI", "fa-solid fa-mobile-screen-button"],
                    ["card", "Card", "fa-regular fa-credit-card"],
                    ["netbanking", "Net Banking", "fa-solid fa-building-columns"],
                  ].map(([mode, label, icon]) => (
                    <button
                      key={mode}
                      type="button"
                      className={fakePayMode === mode ? "active" : ""}
                      onClick={() => setFakePayMode(mode)}
                    >
                      <i className={icon}></i>
                      {label}
                    </button>
                  ))}
                </div>

                <div className="fakepay-body">
                  {fakePayMode === "upi" && (
                    <label>
                      <span>UPI ID</span>
                      <input
                        placeholder="name@bank"
                        value={fakePayDetails.upi}
                        onChange={(e) =>
                          setFakePayDetails((prev) => ({ ...prev, upi: e.target.value }))
                        }
                      />
                    </label>
                  )}

                  {fakePayMode === "card" && (
                    <>
                      <label>
                        <span>Card Number</span>
                        <input
                          placeholder="4111 1111 1111 1111"
                          value={fakePayDetails.card}
                          onChange={(e) =>
                            setFakePayDetails((prev) => ({ ...prev, card: e.target.value }))
                          }
                        />
                      </label>
                      <label>
                        <span>Name on Card</span>
                        <input
                          placeholder="John Doe"
                          value={fakePayDetails.name}
                          onChange={(e) =>
                            setFakePayDetails((prev) => ({ ...prev, name: e.target.value }))
                          }
                        />
                      </label>
                      <div className="fakepay-row">
                        <label>
                          <span>Expiry</span>
                          <input
                            placeholder="MM/YY"
                            value={fakePayDetails.expiry}
                            onChange={(e) =>
                              setFakePayDetails((prev) => ({ ...prev, expiry: e.target.value }))
                            }
                          />
                        </label>
                        <label>
                          <span>CVV</span>
                          <input
                            placeholder="123"
                            value={fakePayDetails.cvv}
                            onChange={(e) =>
                              setFakePayDetails((prev) => ({ ...prev, cvv: e.target.value }))
                            }
                          />
                        </label>
                      </div>
                    </>
                  )}

                  {fakePayMode === "netbanking" && (
                    <label>
                      <span>Select Bank</span>
                      <select defaultValue="hdfc">
                        <option value="hdfc">HDFC Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                      </select>
                    </label>
                  )}
                </div>

                <div className="fakepay-footer">
                  <div>
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Fake payment. No real money will be charged.</span>
                  </div>
                  <button type="button" onClick={handleFakePayment}>
                    Pay {formatPrice(finalTotal)}
                  </button>
                </div>
              </>
            )}

            {paymentStage === "processing" && (
              <div className="fakepay-status">
                <div className="fakepay-loader"></div>
                <h2>Processing Payment</h2>
                <p>Connecting to secure payment gateway...</p>
                <div className="fakepay-skeleton">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {paymentStage === "success" && (
              <div className="fakepay-status success">
                <div className="fakepay-success-ring">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h2>Payment Successful</h2>
                <p>Your order is confirmed. Opening tracking page...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {notice && (
        <div className={`checkout-toast ${notice.type === "error" ? "is-error" : ""}`}>
          <span>{notice.message}</span>
          <button type="button" onClick={() => setNotice(null)}>x</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
