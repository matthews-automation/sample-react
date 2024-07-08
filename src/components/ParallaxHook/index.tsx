'use client';

import { useEffect, useRef, useState, RefObject } from "react";

interface ParallaxHookProps {
  imageRef: RefObject<HTMLImageElement>; // Specify HTMLImageElement for image ref
  elementPosition: number;
}

function ParallaxHook(): ParallaxHookProps {
  const imageRef = useRef<HTMLImageElement>(null); // Use HTMLImageElement type
  const [elementPosition, setElementPosition] = useState(10); // Initial position

  const calculateElementPosition = (entry: IntersectionObserverEntry) => {
    const viewportHeight = window.innerHeight;
    const rect = entry.boundingClientRect;
    const imageTop = rect.top;
    const imageBottom = rect.bottom;
    
    // Calculate position relative to center of the viewport
    const position = ((imageTop + imageBottom) / 2 / viewportHeight - 0.5) * 20; // Scale to -10 to 10 range
    setElementPosition(position);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          calculateElementPosition(entry);
        } else {
          setElementPosition(0);
        }
      },
      {
        threshold: 0 // Trigger callback even when image just starts to enter
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    const handleScroll = () => {
      if (imageRef.current) {
        const entry = imageRef.current.getBoundingClientRect();
        const mockEntry: IntersectionObserverEntry = {
          boundingClientRect: entry,
          intersectionRatio: 1, // Assume full visibility 
          intersectionRect: entry,
          isIntersecting: true,
          rootBounds: null,
          target: imageRef.current,
          time: 0,
        };
        calculateElementPosition(mockEntry);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { imageRef, elementPosition };
}

export default ParallaxHook;
