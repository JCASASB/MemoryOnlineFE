import React, { useEffect, type PropsWithChildren } from "react";

const PreventPullToRefresh: React.FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length === 1) {
        startY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // If page is scrolled to top and user is pulling downwards, prevent the default
      if (window.scrollY === 0 && deltaY > 0) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return <div style={{ touchAction: "pan-x" }}>{children}</div>;
};

export default PreventPullToRefresh;
