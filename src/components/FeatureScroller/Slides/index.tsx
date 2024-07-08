"use client";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import { useRef, useState, useLayoutEffect } from "react";
import { useViewSize } from "@/providers/view-size";
import LogoBG from "@/assets/icons/logo-mask-bg.svg";
import { useScroll } from "@/providers/scroll-pos";
import Slide from "./Slide";
import Progress from '@/assets/icons/progress.svg';

import "./index.scss";

export default function FeatureScrollerSlides(props: {
  slides: Homepage["acf"]["feature_scroller"]["slides"];
}) {
  const introTL = useRef<GSAPTimeline>();
  const outrolTL = useRef<GSAPTimeline>();
  const progressTL = useRef<GSAPTimeline>();
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentProgress, setCurrentProgress] = useState({ intro: 0, outro: 0, total: 0 });
  const bgRef = useRef<HTMLDivElement>(null);
  const lastHeight = useRef(0);
  const lastWidth = useRef(0);
  const logoBgRef = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const { slides } = props;
  const { viewWidth, viewHeight } = useViewSize();
  const { scrollPos } = useScroll();

  const getOffsets = (selector: string, parentSelector = ".feature-scroller") => {
    const alignTarget = document.querySelector(selector);
    const parent = document.querySelector(parentSelector);
    if (!alignTarget || !parent) return { offsetX: 0, offsetY: 0 };
    const rect = alignTarget.getBoundingClientRect();
    const centerX = viewWidth / 2;
    const centerY = viewHeight / 2;
    const parentRect = parent.getBoundingClientRect();
    const offsetX = centerX - (rect.left + rect.width / 2);
    const offsetY = centerY - (rect.top + rect.height / 2) + parentRect.top;
    return { offsetX, offsetY };
  };

  const getTransformValues = (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    const transform = style.transform;
    let x = 0, y = 0;
    if (transform && transform !== 'none') {
      const matrixValues = transform.match(/matrix.*\((.+)\)/)?.[1].split(', ');
      if (matrixValues) {
        if (matrixValues.length === 6) {
          x = parseFloat(matrixValues[4]);
          y = parseFloat(matrixValues[5]);
        } else if (matrixValues.length === 16) {
          x = parseFloat(matrixValues[12]);
          y = parseFloat(matrixValues[13]);
        }
      }
    }
    return { x, y };
  }

  const createProgressTL = () => {
    if (progressTL.current) progressTL.current.kill();
    const progressTimeline = gsap.timeline({ paused: true });
    const circle = progressRef.current?.querySelector(".progress_svg__progress-circle");
    gsap.registerPlugin(DrawSVGPlugin);
    if (circle) progressTimeline.fromTo(circle, { drawSVG: 0 }, { drawSVG: "100%", duration: 1, ease: "none" });
    progressTimeline.progress(currentProgress.total);
    progressTL.current = progressTimeline;
  };

  const createIntroTL = () => {
    if (introTL.current) introTL.current.kill();
    const svg = document.querySelector(".scroller-target") as SVGElement;
    const target = svg?.querySelector(".logo-mask_svg__target-box");
    if (!target || !svg) return;
    const squareRect = target.getBoundingClientRect();
    const iconRect = svg.getBoundingClientRect();
    const firstSection = document.querySelector('.feature-scroller .first-section .row') as HTMLElement;
    const scale = Math.max(viewHeight / squareRect.height, viewWidth / squareRect.width);
    const iconOffsets = getOffsets(".scroller-target");
    const halfWidth = viewWidth / 2;
    const halfHeight = viewHeight / 2;
    const offsetY = (squareRect.top - iconRect.top) * scale;
    const offsetX = (squareRect.left - iconRect.left) * scale;
    const maskStartPositions = { x: halfWidth - iconRect.width / 2 - iconOffsets.offsetX, y: halfHeight - iconRect.height / 2 - iconOffsets.offsetY };
    const maskStartPosition = `${maskStartPositions.x}px ${maskStartPositions.y}px`;
    const maskEndPosition = `-${offsetX}px -${offsetY}px`;
    const introTimeline = gsap.timeline({ paused: true })
    .add('start')
    .fromTo(firstSection, { opacity: 1 }, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 'start')
    .fromTo(contentRef.current, {
      top: '-10dvh',
      height: '110vh',
      maskSize: `auto ${iconRect.height}px`,
      maskPosition: maskStartPosition
    }, {
      top: '0dvh',
      height: '100vh',
      maskSize: `auto ${iconRect.height * scale}px`,
      maskPosition: maskEndPosition,
      duration: 1,
      ease: 'none'
    }, 'start')
    .fromTo(logoBgRef.current, { opacity: 1 }, { opacity: 0, duration: 0.4, ease: 'power1.out' }, 'start')
    .fromTo(logoBgRef.current, { scale: 1, x: maskStartPositions.x, y: maskStartPositions.y },
      {
        scale: scale,
        x: -offsetX - 10,
        y: -offsetY,
        force3D: true,
        duration: 1,
        ease: 'none'
      }, 'start')
    .fromTo(wrapperRef.current, { scale: 1 }, { scale: 1, duration: 1, ease: 'none' }, 'start');
    introTimeline.progress(currentProgress.intro);
    introTL.current = introTimeline;
  };

  const createOutroTL = () => {
    if (outrolTL.current) outrolTL.current.kill();
    const el = document.querySelector(".scroller-outro-target");
    const elParent = document.querySelector<HTMLElement>(".feature-scroller .overview-images .container");
    const lastSlide = document.querySelector('.feature-scroller-slide.last');
    if (!el || !root.current || !elParent || !wrapperRef.current || !lastSlide) return;
    setContentHeight(root.current.clientHeight);
    const elRect = el.getBoundingClientRect();
    const duration = 10;
    const parentRect = elParent.getBoundingClientRect();
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const slideBg = lastSlide.querySelector('.feature-scroller-slide__bg');
    const slideContent = lastSlide.querySelectorAll('.container');
    const sectionOffset = viewHeight * 0.65;
    const elTop = (elRect.top - parentRect.top) + sectionOffset;
    const outroTimeline = gsap.timeline({ paused: true });
    const wrapperTransform = getTransformValues(wrapperRef.current);
    const offsetX = ((elRect.left + elRect.width / 2) - wrapperRect.width / 2) - wrapperRect.left + wrapperTransform.x;
    const offsetY = ((elTop + elRect.height / 2) - wrapperRect.height / 2);
    const startClipPath = `inset(0% 0%)`;
    const clipEndTop = 50 - elRect.height / viewHeight * 50;
    const clipEndBottom = 50 - elRect.width / viewWidth * 50;
    const finalClipPath = `inset(${clipEndTop}% ${clipEndBottom}%)`;
    const imageScale = Math.max(elRect.width / viewWidth, elRect.height / viewHeight);
    
    outroTimeline.set(contentRef.current, { maskImage: 'none' }, 0);
    outroTimeline.fromTo(wrapperRef.current, { clipPath: startClipPath, rotate: 0 }, { clipPath: finalClipPath, duration, ease: "linear", force3D: true }, 0);
    outroTimeline.fromTo(slideContent, { opacity: 1 }, { opacity: 0, duration: 0.01, ease: "power1.out" }, 0);
    outroTimeline.fromTo(slideBg, { scale: 1.1 }, { scale: imageScale, y: 0, duration, ease: 'linear', force3D: true }, 0);
    outroTimeline.fromTo(wrapperRef.current, { y: 0, x: 0 }, { y: offsetY, x: offsetX, duration, ease: "linear", force3D: true }, 0); 
    outroTimeline.fromTo(elParent, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 4, ease: "linear", force3D: true }, duration - 4);
    outroTimeline.progress(currentProgress.outro);
    outrolTL.current = outroTimeline;
  };

  useLayoutEffect(() => {
    const missingTimelines = !introTL.current || !outrolTL.current || !progressTL.current;
    if (!scrollPos || !viewHeight || missingTimelines || !contentHeight) return;
    const introProgress = Math.min(1, Math.max(0, (scrollPos - viewHeight * 1.1) / viewHeight));
    const outroProgress = Math.min(1, Math.max(0, (scrollPos - contentHeight) / (viewHeight / 2)));
    const totalProgress = Math.min(1, Math.max(0, (scrollPos - (viewHeight * 2)) / (contentHeight - (viewHeight * 2))));
    setCurrentProgress({ intro: introProgress, outro: outroProgress, total: totalProgress });
    progressTL.current?.progress(totalProgress);
    introTL.current?.progress(introProgress);
    if (!outroProgress) gsap.set(contentRef.current, { clearProps: 'mask-image' });
    if (outrolTL.current) {
      gsap.to(outrolTL.current, { duration: 0.05, progress: outroProgress, ease: 'linear', overwrite: true }); 
    }
  }, [scrollPos]);

  useLayoutEffect(() => {
    if (viewWidth && viewHeight) {
      if (Math.abs(lastHeight.current - viewHeight) > 10 || Math.abs(lastWidth.current - viewWidth) > 10) {
        lastHeight.current = viewHeight;
        lastWidth.current = viewWidth;
        createIntroTL();
        createOutroTL();
        createProgressTL();
      }
    }
  }, [bgRef, viewHeight, viewWidth, contentRef]);

  return (
    <div className="feature-scroller-slides" ref={root}>
      <div className="feature-scroller-slides__content" ref={contentRef}>
        <div className="feature-scroller-slides__content__wrapper" ref={wrapperRef}>
          {/* <div className="copper-bg" ref={bgRef} /> */}
          <div className="logo-bg" ref={logoBgRef}>
            <LogoBG />
          </div>
          {slides.map((slide, index) => (
            <Slide
              offset={viewHeight}
              key={index}
              index={index}
              sectionHeight={1.66}
              slide={slide}
            />
          ))}
        </div>
        <div className="feature-scroller-slides__progress" ref={progressRef}>
          <Progress />
        </div>
      </div>
    </div>
  );
}
