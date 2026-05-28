import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STORAGE_KEY = "scroll-positions";

const readPositions = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const writePosition = (key, value) => {
  const positions = readPositions();
  positions[key] = value;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
};

const getPageKey = (location) => `${location.pathname}${location.search}`;

const scrollInstantly = (top) => {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo({ top, left: 0, behavior: "auto" });

  requestAnimationFrame(() => {
    root.style.scrollBehavior = previousBehavior;
  });
};

const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPageKeyRef = useRef(getPageKey(location));

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    const pageKey = getPageKey(location);
    const savePosition = () => writePosition(pageKey, window.scrollY);

    window.addEventListener("scroll", savePosition, { passive: true });
    window.addEventListener("beforeunload", savePosition);

    return () => {
      savePosition();
      window.removeEventListener("scroll", savePosition);
      window.removeEventListener("beforeunload", savePosition);
    };
  }, [location]);

  useLayoutEffect(() => {
    const previousPageKey = previousPageKeyRef.current;
    writePosition(previousPageKey, window.scrollY);

    const pageKey = getPageKey(location);
    const savedPosition = readPositions()[pageKey];

    if (navigationType === "POP" && typeof savedPosition === "number") {
      scrollInstantly(savedPosition);
    } else {
      scrollInstantly(0);
    }

    previousPageKeyRef.current = pageKey;
  }, [location, navigationType]);

  return null;
};

export default ScrollManager;
