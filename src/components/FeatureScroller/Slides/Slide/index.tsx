"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import cn from "classnames";
import { useScroll } from "@/providers/scroll-pos";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { useViewSize } from "@/providers/view-size";
import ProgressOverlay from "@/components/Overlay";
import SplitHeadline from "../SplitHeadline";


import './index.scss';

type Props = {
  index: number;
  sectionHeight: number;
  slide: Homepage["acf"]["feature_scroller"]["slides"][0];
  offset: number;
  isMobile?: boolean;
}

export default function Slide({ index, sectionHeight, slide, offset, isMobile }: Props) {
  const { scrollPos } = useScroll();
  const { viewHeight } = useViewSize();
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const bgTl = useRef<GSAPTimeline>();
  const baseHeightModifier = 1.1;
  const [position, setPosition] = useState(index && !isMobile ? viewHeight * baseHeightModifier : 0);
  const [animate, setAnimate] = useState(false);
  const [overlayProgress, setOverlayProgress] = useState(0);
  const top = useRef(0);

  useLayoutEffect(() => {
    if (!isMobile) {
      const scroll = scrollPos - offset;
      const perSectionHeight = viewHeight * sectionHeight;
      const currentPos = scroll - (perSectionHeight * (index + 1)) + perSectionHeight;
      const progress = Math.min(1, Math.max(0, currentPos / perSectionHeight));
      if (!index) {
        if (!animate && progress > 0.4) setAnimate(true);
        else if (animate && progress < 0.4) setAnimate(false);
      } else {
        if (!animate && progress > 0.35) setAnimate(true);
        else if (animate && progress < 0.35) setAnimate(false);
      }
      if (bgTl.current) bgTl.current.progress(progress);
      if (index !== 2) {
        const nextPosition = Math.min(viewHeight, Math.max(0, viewHeight - (scroll - viewHeight * (sectionHeight * (index + 1)))));  
        const positionProgress = Math.min(1, Math.max(0, nextPosition / viewHeight));
        setOverlayProgress(1 - positionProgress);
      }
      if (!index || isMobile) return;
      const position = Math.min(viewHeight * baseHeightModifier, Math.max(0, viewHeight - (scroll - viewHeight * (sectionHeight * index))));
      setPosition(position);
    } else if (rootRef.current) {
      top.current = rootRef.current.getBoundingClientRect().top + scrollPos;
      const progress = Math.min(1, Math.max(0, (scrollPos - top.current + viewHeight) / viewHeight));
      if (bgTl.current) bgTl.current.progress(progress);
      if (!animate && progress >= 0.5) setAnimate(true);
      else if (animate && progress < 0.5) setAnimate(false);
    }
  }, [scrollPos, viewHeight, index, sectionHeight])

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(bgRef.current, { y: '5%', force3D: true }, { y: '-5%', ease: 'linear' });
    bgTl.current = tl;
  }, []);
  return (
    <div
      key={index}
      ref={rootRef}
      style={{ transform: `translateY(${position}px)` }}
      className={cn(
        "feature-scroller-slide",
        !index && "first ap-parent",
        animate && "appear",
        index === 2 && "last"
      )}
    >
      <img
        className={"feature-scroller-slide__bg"}
        ref={bgRef}
        src={slide.image}
        role="presentation"
      />
      <ProgressOverlay progress={overlayProgress}  />
      <div className="feature-scroller-slide__content d-flex align-center justify-center" style={{ transform: `translateY(${-position}px)` }}>
        <div className="container">
          <div className="row copy-row">
            <span className="slide-label eyebrow ap-child col-lg-2" dangerouslySetInnerHTML={{ __html: slide.label }}/>
            <div className="col-lg-8 col-lg-offset-1">
              <SplitHeadline
                sectionHeight={sectionHeight}
                offset={viewHeight}
                isMobile={isMobile}
                copy={slide.headline}
                className="subtitle-2 ap-child"
                index={index}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container feature-scroller-slide__bottom">
        <div className={cn("row justify-end", !index && "ap-child")}>
          <PrimaryButton url={slide.button.url} label={slide.button.title} />
        </div>
      </div>
    </div>
  );
}
