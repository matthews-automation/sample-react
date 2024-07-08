"use client";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import cn from "classnames";
import { useLayoutEffect, useRef } from "react";
import { useScroll } from "@/providers/scroll-pos";
import { useViewSize } from "@/providers/view-size";

type Props = {
  copy: string;
  className?: string;
  index: number;
  offset: number;
  sectionHeight: number;
  isMobile?: boolean;
};

export default function SplitHeadline(props: Props) {
  const root = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLSpanElement>(null);
  const { copy, className, index, offset, sectionHeight, isMobile } = props;
  const lineAnims = useRef<boolean[]>([]);
  const timeline = useRef<GSAPTimeline>();
  const { scrollPos } = useScroll();
  const { viewHeight } = useViewSize();

  useLayoutEffect(() => {
    gsap.registerPlugin(SplitText);
    let split = new SplitText(copyRef.current, {
      type: "words",
      wordsClass: "word",
    });
    gsap.set(split.words, { opacity: 0.4 });
    const tl = gsap.timeline({ paused: true });
    split.words.forEach((word) => {
      tl.to(word, { opacity: 1, duration: 0.4, ease: "linear" });
    });
    timeline.current = tl;
    return () => split.revert();
  }, []);

  useLayoutEffect(() => {
    if (!parent || !timeline.current || !root.current) return;
    if (!isMobile) {
      const scroll = scrollPos - offset;
      const perSectionHeight = viewHeight * sectionHeight;
      const scrollDistance = perSectionHeight - viewHeight;
      const currentPos = scroll - perSectionHeight * (index + 1) + scrollDistance;
      const progress = Math.min(1, Math.max(0, currentPos / scrollDistance));
      timeline.current.progress(progress);
    } else {
      const top = root.current.getBoundingClientRect().top + scrollPos;
      const progress = Math.min(1, Math.max(0, (scrollPos - top + viewHeight) / (viewHeight * 0.75)));
      timeline.current.progress(progress);
    }
  }, [scrollPos, lineAnims]);

  return (
    <div className={cn("split-headline", className)} ref={root}>
      <span className="copy" ref={copyRef} dangerouslySetInnerHTML={{ __html: copy }}/>
    </div>
  );
}
