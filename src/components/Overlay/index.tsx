"use client";
import { useEffect, useRef, useState } from "react";
import { useScroll } from "@/providers/scroll-pos";
import { useViewSize } from "@/providers/view-size";

import "./index.scss";

export default function ProgressOverlay(props: {
  progress?: number;
  finalPosition?: number;
  opacityEnd?: number;
}) {
  const [opacity, setOpacity] = useState(0);
  const { viewHeight } = useViewSize();
  const root = useRef<HTMLDivElement>(null);
  const { opacityEnd = 0.85, progress, finalPosition } = props;
  const endPos = finalPosition || viewHeight;
  const { scrollPos } = useScroll();
  
  useEffect(() => {
    if (progress === undefined && scrollPos) {
      const progress = Math.min(1, Math.max(0, scrollPos / endPos));
      setOpacity(progress * opacityEnd);
    }
  }, [scrollPos]);
  useEffect(() => {
    if (progress) {
      const normalizedProgress = Math.min(1, Math.max(0, progress));
      setOpacity(normalizedProgress * opacityEnd);
    }
  }, [progress]);
  return <div className="progress-overlay" style={{ opacity }} ref={root} />;
}
