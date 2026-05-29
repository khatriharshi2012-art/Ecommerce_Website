import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import "./pages.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const decodeJwtPayload = (token) => {
  const payload = token.split(".")[1];
  if (!payload) {
    throw new Error("Invalid Google credential.");
  }

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = window.atob(normalized);
  return JSON.parse(decoded);
};

const Login = () => {
  const { user, login, signup, googleLogin, resetPassword } =
    useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const googleButtonRef = useRef(null);

  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPasswordValue, setResetPasswordValue] = useState("");

  const redirectPath = location.state?.from?.pathname || "/";
  const redirectSearch = location.state?.from?.search || "";
  const redirectUrl = `${redirectPath}${redirectSearch}`;

  useEffect(() => {
    if (user) {
      navigate(redirectUrl, { replace: true });
    }
  }, [navigate, redirectUrl, user]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const mode = searchParams.get("mode");
      setIsLogin(mode !== "signup");
      setShowForgotPassword(false);
      setErrorMessage(location.state?.authMessage || "");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.state, searchParams]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current) {
      return undefined;
    }

    let cancelled = false;

    const renderGoogleButton = () => {
      if (
        cancelled ||
        !window.google?.accounts?.id ||
        !googleButtonRef.current
      ) {
        return false;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          try {
            const profile = decodeJwtPayload(response.credential);
            const account = googleLogin(profile);

            if (!account) {
              setErrorMessage("Google sign-in failed. Please try again.");
              return;
            }

            navigate(redirectUrl, {
              state: { authMessage: "Login successful!" },
            });
          } catch {
            setErrorMessage("Google sign-in failed. Please try again.");
          }
        },
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: 320,
      });

      return true;
    };

    if (renderGoogleButton()) {
      return () => {
        cancelled = true;
        window.google?.accounts?.id?.cancel();
      };
    }

    const intervalId = window.setInterval(() => {
      if (renderGoogleButton()) {
        window.clearInterval(intervalId);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.google?.accounts?.id?.cancel();
    };
  }, [googleLogin, navigate, redirectUrl]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setErrorMessage("");
  };

  const handleModeChange = () => {
    const nextIsLogin = !isLogin;
    setIsLogin(nextIsLogin);
    setShowForgotPassword(false);
    setResetEmail("");
    setResetPasswordValue("");
    resetForm();
    setSearchParams(nextIsLogin ? {} : { mode: "signup" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (isLogin) {
      const account = login(email, password);
      if (!account) {
        setErrorMessage("Invalid email or password.");
        return;
      }

      navigate(redirectUrl, {
        state: { authMessage: "Login successful!" },
      });
      return;
    }

    const account = signup({ name, email, password });
    if (!account) {
      setErrorMessage("This email is already registered.");
      return;
    }

    navigate(redirectUrl, {
      state: { authMessage: "Signup successful!" },
    });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!resetEmail || !resetPasswordValue) {
      setErrorMessage("Enter your email and a new password first.");
      return;
    }

    const result = resetPassword(resetEmail, resetPasswordValue);
    if (result === "google-account") {
      setErrorMessage(
        "This account uses Google sign-in. Please continue with Google.",
      );
      return;
    }

    if (!result) {
      setErrorMessage("We could not find that email.");
      return;
    }

    notify("Password updated successfully.");
    setShowForgotPassword(false);
    setPassword("");
    setResetEmail("");
    setResetPasswordValue("");
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>
          {showForgotPassword
            ? "Reset Password"
            : isLogin
              ? "Login"
              : "Sign Up"}
        </h2>
        {/* <p className="auth-session-note">
          {" "}
          {Math.round(sessionDuration / 60000)} minutes.
        </p> */}

        {!showForgotPassword && (
          <>
            <div className="google-auth-block">
              {GOOGLE_CLIENT_ID ? (
                <div ref={googleButtonRef} className="google-auth-render"></div>
              ) : (
                <p className="auth-message auth-error">
                  Google sign-in needs `VITE_GOOGLE_CLIENT_ID` in your
                  environment.
                </p>
              )}
            </div>

            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <label className="auth-field-label">Email</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="auth-field-label">Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>

            {isLogin && (
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </button>
            )}
          </>
        )}

        {showForgotPassword && (
          <div className="forgot-password-card">
            <input
              type="email"
              placeholder="Email Address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={resetPasswordValue}
              onChange={(e) => setResetPasswordValue(e.target.value)}
            />
            <button type="button" onClick={handleForgotPassword}>
              Update Password
            </button>
            <button
              type="button"
              className="forgot-password-btn forgot-password-back"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to login
            </button>
          </div>
        )}

        {errorMessage && (
          <p className="auth-message auth-error">{errorMessage}</p>
        )}

        {!showForgotPassword && (
          <button type="submit">{isLogin ? "Login" : "Create Account"}</button>
        )}

        {!showForgotPassword && (
          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={handleModeChange}>
              {isLogin ? " Sign Up" : " Login"}
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
