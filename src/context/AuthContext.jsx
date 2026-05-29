/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { readStorage, writeStorage } from "../utils/storage";
import { notifyGlobal } from "./NotificationContext";

const AuthContext = createContext();
const SESSION_TIME = 24 * 60 * 60 * 1000; // 1 day

const normalizeValue = (value = "") => value.trim().toLowerCase();
const GOOGLE_PROVIDER = "google";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = readStorage("user", null);
    if (stored && stored.expiry > Date.now()) return stored;
    localStorage.removeItem("user");
    return null;
  });
  const [users, setUsers] = useState(() => readStorage("users", []));
  const [loading] = useState(false);

  useEffect(() => {
    writeStorage("users", users);
  }, [users]);

  useEffect(() => {
    if (!user?.expiry) return undefined;

    const remainingTime = user.expiry - Date.now();
    if (remainingTime <= 0) {
      const timeoutId = window.setTimeout(() => {
        setUser(null);
        localStorage.removeItem("user");
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      setUser(null);
      localStorage.removeItem("user");
      notifyGlobal("Your session expired. Please login again.", "error");
    }, remainingTime);

    return () => window.clearTimeout(timeoutId);
  }, [user]);

  const createSession = (account) => {
    const sessionUser = {
      ...account,
      expiry: Date.now() + SESSION_TIME,
    };

    setUser(sessionUser);
    writeStorage("user", sessionUser);
    return sessionUser;
  };

  const login = (email, password) => {
    const normalizedEmail = normalizeValue(email);
    const foundUser = users.find(
      (account) =>
        account.email &&
        normalizeValue(account.email) === normalizedEmail &&
        account.password === password
    );
    if (!foundUser) return false;

    createSession(foundUser);
    return foundUser;
  };

  const signup = ({ name, email = "", password }) => {
    const normalizedEmail = normalizeValue(email);

    if (
      users.find((account) => {
        return (
          normalizedEmail &&
          account.email &&
          normalizeValue(account.email) === normalizedEmail
        );
      })
    ) {
      return false;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password,
      provider: "email",
    };

    setUsers((prev) => [...prev, newUser]);
    createSession(newUser);
    return newUser;
  };

  const googleLogin = (profile) => {
    const normalizedEmail = normalizeValue(profile.email);
    if (!normalizedEmail) return false;

    const existingUser = users.find(
      (account) =>
        account.email &&
        normalizeValue(account.email) === normalizedEmail
    );

    const googleUser = {
      name: profile.name?.trim() || profile.email,
      email: profile.email.trim(),
      picture: profile.picture || "",
      googleId: profile.sub,
      provider: GOOGLE_PROVIDER,
    };

    if (existingUser) {
      const mergedUser = {
        ...existingUser,
        ...googleUser,
      };

      setUsers((prev) =>
        prev.map((account) =>
          account.email &&
          normalizeValue(account.email) === normalizedEmail
            ? mergedUser
            : account
        )
      );
      createSession(mergedUser);
      return mergedUser;
    }

    setUsers((prev) => [...prev, googleUser]);
    createSession(googleUser);
    return googleUser;
  };

  const resetPassword = (email, newPassword) => {
    const normalizedEmail = normalizeValue(email);
    const targetUser = users.find(
      (account) =>
        account.email &&
        normalizeValue(account.email) === normalizedEmail
    );

    if (!targetUser) return false;
    if (targetUser.provider === GOOGLE_PROVIDER) {
      return "google-account";
    }

    setUsers((prev) =>
      prev.map((account) =>
        account === targetUser ? { ...account, password: newPassword } : account
      )
    );
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleLogin,
        resetPassword,
        logout,
        sessionDuration: SESSION_TIME,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
