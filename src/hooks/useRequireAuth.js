import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const useRequireAuth = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (
    message = "Please login first to continue.",
  ) => {
    if (user) return true;

    notify(message, "error");
    navigate("/login", {
      state: {
        from: {
          pathname: location.pathname,
          search: location.search,
        },
        authMessage: message,
      },
    });
    return false;
  };

  return { user, requireAuth };
};

export default useRequireAuth;
