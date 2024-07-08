"use client";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import cn from "classnames";
import Hyphenated from "react-hyphen";
import SplitText from "gsap/SplitText";
import Image, { StaticImageData } from "next/image";
import { useSearchParams } from "next/navigation";
import { CSSTransition } from "react-transition-group";
import Spline from "@splinetool/react-spline";
import emitter from "@/core/EventBus";
import InlineButton from "@/components/Buttons/InlineButton";
import { getHighlightedCopy, parseHeadlineHighlight } from "@/core/utils";
import ScrollContextProvider from "@/providers/scroll-pos";
import VideoModal from "@/components/VideoModal";
import fallback1 from "@/assets/images/hero-fallback-1.jpg";
import fallback1Lg from "@/assets/images/hero-fallback-1-lg.jpg";
import fallback2 from "@/assets/images/hero-fallback-2.jpg";
import fallback2Lg from "@/assets/images/hero-fallback-2-lg.jpg";
import fallback3 from "@/assets/images/hero-fallback-3.jpg";
import fallback3Lg from "@/assets/images/hero-fallback-3-lg.jpg";
import fallback4 from "@/assets/images/hero-fallback-3.jpg";
import fallback4Lg from "@/assets/images/hero-fallback-3-lg.jpg";
import ProgressOverlay from "@/components/Overlay";
import { useOptions } from "@/providers/options";

import "./index.scss";

type Props = {
  data: WebGLHero;
  isIOS: boolean;
  includeSubNav?: boolean;
}

export default function WebGLHero(props: Props) {
  gsap.config({ nullTargetWarn: false });
  const { variant, headline, description, video } = props.data;
  const { isIOS } = props;
  const overlayRef = useRef(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { options: { continue_cta } } = useOptions();
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [error, setError] = useState(false);

  const params = useSearchParams();
  const useFallback = isIOS || params.get("fallback") === "true";

  const parsedHeadline = parseHeadlineHighlight(headline, 'strip');
  const highlightedCopy = getHighlightedCopy(headline); 
  const heroBlackEl = useRef<HTMLDivElement>(null);
  const heroCopyOffscreenEl = useRef<HTMLHeadingElement>(null);
  const heroCopyOnscreenEl = useRef<HTMLHeadingElement>(null);
  const heroRowBottomEl = useRef<HTMLDivElement>(null);
  const heroCopyTL = useRef<GSAPTimeline>();

  const splineMap: { [key in WebGLHeroVariants]: string } = {
    one: "https://prod.spline.design/ZXvF5YIzRZJbwa6U/scene.splinecode",
    two: "https://prod.spline.design/p9nnnJTCthV1Xxpr/scene.splinecode",
    three: "https://prod.spline.design/jDF7eEZTozMZiUrS/scene.splinecode",
    four: "https://prod.spline.design/R9yBDyXmmfbZ7zcn/scene.splinecode",
  };
  const fallbackMap: { [key in WebGLHeroVariants]: { sm: StaticImageData; lg: StaticImageData } } = {
    one: { sm: fallback1, lg: fallback1Lg },
    two: { sm: fallback2, lg: fallback2Lg },
    three: { sm: fallback3, lg: fallback3Lg },
    four: { sm: fallback4, lg: fallback4Lg }
  };

  const returnheroCopyTL = () => {
    if (!heroCopyOnscreenEl.current) return;
    let split = new SplitText(heroCopyOffscreenEl.current, { type: "words,lines", linesClass: "gline" });
    split.words.forEach((word) => {
      if (word.textContent) {
        let normalizedTextContent = word.textContent.replace(/\u00AD/g, ''); // remove soft hyphens for comapare - MA
        if (highlightedCopy.includes(normalizedTextContent)) {
          word.innerHTML = `
            <span class="gradient-text-wrapper">
              <span class="gradient-text">${word.textContent}</span>
              <span class="normal-text">${word.textContent}</span>
            </span>`;
        }
      }
    });
    heroCopyOnscreenEl.current!.innerHTML = split.lines.map((word) => word.outerHTML).join(" ");

    const gradientTexts = heroCopyOnscreenEl.current.getElementsByClassName("gradient-text");
    const normalText = heroCopyOnscreenEl.current.getElementsByClassName("normal-text");

    heroCopyTL.current = gsap.timeline({ paused: true });
    heroCopyTL.current.from("h1.onscreen .gline", {
      duration: 1.2,
      ease: "power2.out",
      opacity: 0,
      x: -20,
      force3D: true,
      stagger: 0.2,
    });
    heroCopyTL.current.to(gradientTexts, { opacity: 1, duration: 1, ease: "power1.inOut" }, "-=1");
    heroCopyTL.current.to(normalText, { opacity: 0, duration: 1, ease: "power1.inOut" }, "-=1");
    heroCopyTL.current.call(showRowBottom, [], "-=1.25");

    return split;
  };
  const handleVideoOpen = (open: boolean) => {
    setShowVideoOverlay(open);
  };

  const handleError = () => { setError(true); };

  const handleScrollDown = () => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    let subNavHeight = 0;
    if (props.includeSubNav) {
      const navRect = document.querySelector(".sub-navigation")?.getBoundingClientRect();
      subNavHeight = navRect?.height || 0;
    }
    window.scrollTo({ top: rect.bottom + subNavHeight, behavior: "smooth" });
  };

  const fadeFromBlack = () => {
    heroBlackEl.current?.addEventListener("transitionend", fadeFromBlackComplete);
    heroBlackEl.current?.classList.add("hide");
  };

  const fadeFromBlackComplete = () => {
    heroBlackEl.current?.remove();
    heroCopyTL.current?.play();
  };

  const showRowBottom = () => {
    heroRowBottomEl.current?.classList.remove("hidden");
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(SplitText);
    emitter.on("VIDEO_OPEN", handleVideoOpen);
    const split = returnheroCopyTL();
    gsap.delayedCall(0.4, fadeFromBlack);
    return () => {
      split?.revert();
      emitter.off("VIDEO_OPEN", handleVideoOpen);
    };
  }, []);

  return (
    <div className="webgl-hero">
      <div className="webgl-hero__content" ref={heroRef}>
        <ScrollContextProvider>
          <ProgressOverlay />
        </ScrollContextProvider>
        <Suspense>
          { !error && !useFallback &&
            <Spline
              className="webgl-hero__spline"
              scene={`${splineMap[variant]}`}
              onError={handleError}
            />
          }
        </Suspense>
        <div className={cn("webgl-hero__fallback", { 'visible': error || useFallback })}>
          <Image className="small" src={fallbackMap[variant].sm} alt="" loading="eager" />
          <Image className="large" src={fallbackMap[variant].lg} alt="" loading="eager" />
        </div>

        <div className="container webgl-hero__text-container">
          <div className="row">
            {variant === "one" && (
              <div className="col-12 col-lg-9 col-xl-9 header-col">
                <h1 ref={heroCopyOnscreenEl} className="display-1 onscreen"/>
                <Hyphenated>
                  <h1 ref={heroCopyOffscreenEl} className="display-1 offscreen" aria-hidden={true} dangerouslySetInnerHTML={{ __html: parsedHeadline }} />
                </Hyphenated>
              </div>
            )}
            <div className={`row-bottom ${variant === "one" ? "hidden" : ""}`} ref={heroRowBottomEl}>
              <div className="col-12 col-md-6 copy-col" lang="en-US">
                {variant !== "one" && (
                  <>
                    <h1 className="display-2 landing-h2 uppercase onscreen" ref={heroCopyOnscreenEl} />
                    <Hyphenated>
                      <h1 className="display-2 uppercase offscreen" aria-hidden={true} ref={heroCopyOffscreenEl} dangerouslySetInnerHTML={{ __html: headline }} />
                    </Hyphenated>
                  </>
                )}
                <p className="body hero-body opacity-70" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
              {video
                && (
                  <>
                    <VideoModal data={video} isIOS={isIOS} />
                    <CSSTransition
                      in={showVideoOverlay}
                      classNames="fade"
                      unmountOnExit
                      timeout={300}
                      nodeRef={overlayRef}
                    >
                      <div className="video-overlay" ref={overlayRef} />
                    </CSSTransition>
                  </>
                )}
              {variant !== "one" && (
                <div className="inline-button">
                  <InlineButton
                    onClick={handleScrollDown}
                    label={continue_cta}
                    arrowDirection="down"
                    lightLabel={true}
                  />
                </div>
              )}
            </div>
            <div className="webgl-hero__black" ref={heroBlackEl}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
