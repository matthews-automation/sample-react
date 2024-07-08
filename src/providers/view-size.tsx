"use client";
import { createContext, useEffect, useState, useRef, useContext } from "react";

const defaultContext = {
  viewWidth: 0,
  viewHeight: 0,
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  isDesktopLarge: false,
};
const ViewSizeContext = createContext(defaultContext);

const ViewSizeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [size, setSize] = useState(defaultContext);
  let prevScrollPos = useRef(0);
  let resizeTimer = useRef<NodeJS.Timeout>();
  const getSize = () => {
    const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const scrollPos = window.scrollY;
    setTimeout(() => { prevScrollPos.current = scrollPos; }, 0);
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width > 1024,
      isDesktopLarge: width > 1440,
      viewHeight: height || 0,
      viewWidth: width || 0,
    };
  };
  const handleResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer.current);
    setSize(getSize());
    document.body.classList.add("resizing");
    resizeTimer.current = setTimeout(() => { document.body.classList.remove("resizing"); }, 250);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => { window.removeEventListener("resize", handleResize); };
  }, []);
  return (
    <ViewSizeContext.Provider value={size}>
      {children}
    </ViewSizeContext.Provider>
  );
};

export const useViewSize = () => useContext(ViewSizeContext);

export default ViewSizeContextProvider;
