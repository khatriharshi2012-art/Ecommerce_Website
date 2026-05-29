/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const NotificationContext = createContext(null);
const NOTIFY_EVENT = "app-notify";

export const notifyGlobal = (message, type = "success") => {
  window.dispatchEvent(
    new CustomEvent(NOTIFY_EVENT, {
      detail: { message, type },
    })
  );
};

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const timerRef = useRef(null);

  const notify = useCallback((message, type = "success") => {
    window.clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        message,
        title: options.title || "Confirm Action",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        tone: options.tone || "default",
        resolve,
      });
    });
  }, []);

  const closeConfirm = (result) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  useEffect(() => {
    const handleNotify = (event) => {
      notify(event.detail?.message || "Done.", event.detail?.type || "success");
    };

    window.addEventListener(NOTIFY_EVENT, handleNotify);
    return () => {
      window.removeEventListener(NOTIFY_EVENT, handleNotify);
      window.clearTimeout(timerRef.current);
    };
  }, [notify]);

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}

      {toast && (
        <div className={`app-toast ${toast.type === "error" ? "is-error" : ""}`}>
          <i className={`fa-solid ${toast.type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}`}></i>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Close notification">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {confirmState && (
        <div className="app-confirm-backdrop" role="dialog" aria-modal="true">
          <div className={`app-confirm ${confirmState.tone === "danger" ? "is-danger" : ""}`}>
            <div className="app-confirm-icon">
              <i className={`fa-solid ${confirmState.tone === "danger" ? "fa-trash" : "fa-circle-question"}`}></i>
            </div>
            <div>
              <h2>{confirmState.title}</h2>
              <p>{confirmState.message}</p>
            </div>
            <div className="app-confirm-actions">
              <button type="button" onClick={() => closeConfirm(false)}>
                {confirmState.cancelText}
              </button>
              <button type="button" className="primary" onClick={() => closeConfirm(true)}>
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const value = useContext(NotificationContext);
  if (!value) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }
  return value;
};
