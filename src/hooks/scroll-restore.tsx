"use client";
import { useEffect } from "react";

export default function ScrollRestorer() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    document.scrollingElement?.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  return <></>;
};
