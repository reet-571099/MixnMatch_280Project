import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on first render to avoid forced reflow
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Use requestAnimationFrame to batch with next paint cycle
    // This prevents forced synchronous layout/reflow
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
}