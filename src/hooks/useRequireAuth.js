import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useRequireAuth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (
    message = "Please login first to continue.",
  ) => {
    if (user) return true;

    alert(message);
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
