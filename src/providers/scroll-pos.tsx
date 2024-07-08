"use client";
import { createContext, useEffect, useState, useRef, useContext } from "react";

const defaultContext = {
  scrollPos: 0,
  isTouch: false,
  direction: "down",
};
const ScrollContext = createContext(defaultContext);

const ScrollContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [pos, setPos] = useState(defaultContext);
  let prevScrollPos = useRef(0);
  const getPos = (touch?: boolean) => {
    const isTouch =
      touch || "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const scrollPos = window.scrollY;
    const direction = scrollPos >= prevScrollPos.current ? "down" : "up";

    setTimeout(() => { prevScrollPos.current = scrollPos; }, 0);

    return {
      direction,
      scrollPos: window.scrollY,
      isTouch,
    };
  };
  const handleTouchStart = () => {
    document.body.classList.add("touch");
    setPos(getPos(true));
    window.removeEventListener("touchstart", handleTouchStart);
  };
  useEffect(() => {
    const handleScroll = () => { setPos(getPos()); };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.addEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <ScrollContext.Provider value={pos}>{children}</ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);

export default ScrollContextProvider;
