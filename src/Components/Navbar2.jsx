import React, { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./components.css";
import AccountMenu from "./AccountMenu";

function Navbar() {
  const { cartCount, totalPrice } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <>
      <nav className="navbar n navbar-expand-md navbar-inner accordion">
        <div className="container-fluid ps px-5">
          <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
            <img src="/img/logo5.jpg" alt="Logo" className="nav-logo" />
          </NavLink>
          <button
            className={`navbar-toggler navbar-inner-toggler ${menuOpen ? "" : "collapsed"}`}
            type="button"
            aria-controls="hero-navbar-menu"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
            id="hero-navbar-menu"
          >
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/everything" onClick={closeMenu}>
                  EVERYTHING
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/women" onClick={closeMenu}>
                  WOMEN
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/men" onClick={closeMenu}>
                  MEN
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/kids" onClick={closeMenu}>
                  KIDS
                </NavLink>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/about" onClick={closeMenu}>
                  ABOUT
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact" onClick={closeMenu}>
                  CONTACT
                </NavLink>
              </li>

              <li className="nav-item cart-icon">
                <Link to="/cart" className="nav-link position-relative" onClick={closeMenu}>
                  <span className="nav-item price-text">${totalPrice.toFixed(2)}</span>
                  <i className="fa-solid fa-bag-shopping fs-6"></i>
                  {cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </Link>
              </li>

              <AccountMenu onAction={closeMenu} />
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default Navbar;
