"use client";
import cn from "classnames";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import ChevronLeft from "@/assets/icons/chevron-left.svg";
import ChevronRight from "@/assets/icons/chevron-right.svg";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useViewSize } from "@/providers/view-size";
import { scaleVal } from "@/core/utils";

import "./index.scss";
import "@splidejs/react-splide/css/core";

export default function Slider({
  slidesPerPage = 1,
  slidesPerPageM = 3,
  slidesPerPageL = 4,
  paddingRight = "30%",
  paddingRightM = "20%",
  paddingRightL = "10%",
  peek = true,
  autoplay,
  children,
  className,
  currentIndex,
  onIndexChange,
  trackClassName,
  isControlled,
  parentSelector = ".splide-custom",
}: SliderProps) {
  const [barStyle, setBarStyle] = useState({});
  const [trackStyle, setTrackStyle] = useState({});
  const [controlStyle, setControlStyle] = useState({});
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<SplideSlide[]>([]);
  const currentSlide = useRef(0);
  const prevSlide = useRef(0);
  const [index, setIndex] = useState(0);
  const splideRef = useRef<typeof Splide>(null);
  const { viewWidth, isDesktop, isMobile } = useViewSize();
  const sliderConfig = useMemo(() => {
    if (isMobile) {
      return { gap: 20, slideCount: slidesPerPage, paddingRight: paddingRight }
    } else if (isDesktop) {
      return { gap: scaleVal(20), slideCount: slidesPerPageL, paddingRight: paddingRightL }
    }
    return { gap: scaleVal(20), slideCount: slidesPerPageM, paddingRight: paddingRightM }
  }, [isMobile, isDesktop, viewWidth]);

  const handleMove = (splide: Splide) => {
    if (onIndexChange) onIndexChange(splide.index);
    setIndex(splide.index);
    var end = splide.Components.Controller.getEnd() + 1;
    prevSlide.current = currentSlide.current;
    currentSlide.current = splide.index;
    if (!slides.length) setSlides(splide.Components.Slides.get());
    var rate = Math.min((splide.index + 1) / end, 1);
    setBarStyle({ width: `${rate * 100}%` });
  };


  // useLayoutEffect(() => {
  //   if (!slides) return;
  //   if (isMobile) {
  //     // slides.forEach((s) => gsap.set(s.slide, { opacity: 1 }));
  //     return;
  //   }
  //   // console.log(currentSlide.current, prevSlide.current)
  //   if (currentSlide.current > prevSlide.current) {
  //     const { slide } = slides[currentSlide.current - 1];
  //     // gsap.to(slide, { opacity: 0, duration: 0.3, ease: "power2.out" });
  //   } else if (currentSlide.current < prevSlide.current) {
  //     const { slide } = slides[currentSlide.current];
  //     // gsap.to(slide, { opacity: 1, duration: 0.3, ease: "power2.out" });
  //   }
  // }, [currentSlide.current, prevSlide.current, slides]);

  useLayoutEffect(() => {
    if (!trackRef.current || !rootRef.current || !parentSelector || !peek) return;
    const track = trackRef.current;
    const parent = document.querySelector(parentSelector) as HTMLElement;
    setTimeout(() => {
      const rect = track.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setTrackStyle({ width: viewWidth - rect.left });
      let controlWidth = parentRect.width + 48;
      if (isMobile) controlWidth = viewWidth - 40;
      setControlStyle({ width: controlWidth });
    }, 50);
  }, [trackRef, viewWidth]);

  useLayoutEffect(() => {
    if (isControlled && currentIndex !== undefined && currentIndex !== index) {
      splideRef.current?.go(currentIndex);
    }
  }, [currentIndex]);

  let autoplayOption = false;
  let interval = 0;

  if (autoplay) {
    (autoplayOption = true), (interval = 5000);
  }
// splide splide-custom is-overflow is-initialized splide--slide splide--ltr is-active
// splide splide-custom is-overflow is-initialized splide--loop splide--ltr is-active
  return (
    <div className={cn("slider-container", className)} ref={rootRef}>
      <Splide
        ref={splideRef}
        className={cn("splide-custom", { "no-peek": !peek, 'no-page': sliderConfig.slideCount >= children.length })}
        options={{
          type: "slide",
          drag: isMobile,
          perPage: sliderConfig.slideCount,
          padding: { right: peek ? sliderConfig.paddingRight : 0 },
          perMove: 1,
          rewind: true,
          gap: sliderConfig.gap,
          pagination: false,
          autoplay: autoplayOption,
          interval: interval,
          resetProgress: true,
          updateOnMove: true,
          pauseOnFocus: true,
        }}
        hasTrack={false}
        onMove={handleMove}
        onMounted={handleMove}
        aria-label="..."
      >
        <div ref={trackRef} style={trackStyle}>
          <SplideTrack className={trackClassName}>
            {children && children.map((child: any, i: number) => <SplideSlide key={i}>{child}</SplideSlide>)}
          </SplideTrack>
          <div
            className="controls-box d-flex align-center"
            style={controlStyle}
          >
            <div className="splide-progress">
              <div className="splide-progress__bar" style={barStyle} />
            </div>
            <div className="d-flex justify-between align-center">
              <div className="splide__arrows d-flex">
                <button className={cn("splide__arrow splide__arrow--prev", /*{ disabled: index === 0 }*/)}>
                  <div className="absolute ripple" />
                  <ChevronLeft />
                </button>
                <button className={cn("splide__arrow splide__arrow--next", /*{ disabled: index === maxMove }*/)}>
                  <div className="absolute ripple" />
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Splide>
    </div>
  );
}
