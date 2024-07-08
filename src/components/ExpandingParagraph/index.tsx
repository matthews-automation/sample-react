'use client';
import { useRef, useState, useEffect, ReactNode } from 'react';
import "./index.scss";
import ChevronUp from "@/assets/icons/chevron-up.svg";

interface ExpandingParagraphtProps {
    content: any;
}

export default function ExpandingParagraph (content: ExpandingParagraphtProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  let innerContent = content.content

  useEffect(() => {
    if (contentRef.current) {
      const { clientHeight, scrollHeight } = contentRef.current;
      if (scrollHeight > 500) {
        setIsOverflowing(true);
      }
    }
  }, [content]);

  let newContent = innerContent.map((item: any, i: number) => {
    if (typeof item === 'object' && item.hasOwnProperty('data')) {
      return item.data;
    } else {
      return '';
    }
  }).join(" ");

  return (
    <>
      <div ref={contentRef} className={`content relative ${isExpanded ? 'expanded' : ''}`} style={{maxHeight: isExpanded ? 'none' : '400px' }}>
        {isOverflowing && (
          <div className="gradient-overlay" />
        )}
      </div>
      {isOverflowing && (
        <button className="toggle-button d-flex align-center" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Show Less' : 'Show More'}
          <div className={`arrow-button ${isExpanded ? "clicked" : ""}`}>
            {isExpanded ? <ChevronUp /> : <ChevronUp />}
          </div>
        </button>
      )}
    </>
  );
}
