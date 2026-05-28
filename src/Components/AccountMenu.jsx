import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AccountMenu({ variant = "default", onAction }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    onAction?.();
    navigate("/");
  };

  const handleMenuAction = () => {
    setOpen(false);
    onAction?.();
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ðŸ”¥ Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      setOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <li className={`nav-item account-wrapper ${variant}`} ref={menuRef}>
      <span
        className="nav-link account-icon"
        onClick={() => setOpen(!open)}
      >
        <i className="fa-solid fa-user"></i>
      </span>

      <div className={`account-dropdown ${open ? "open" : ""}`}>
        {!user ? (
          <>
            <Link to="/login" onClick={handleMenuAction}>
              Login
            </Link>
            <Link to="/login?mode=signup" onClick={handleMenuAction}>
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <p className="user-name">Hi, {user.name}</p>
            <Link to="/orders" onClick={handleMenuAction}>
              My Orders
            </Link>
            <Link to="/wishlist" onClick={handleMenuAction}>
              Liked Products
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </li>
  );
}

export default AccountMenu;
