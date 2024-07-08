"use client";
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import gsap from "gsap";
import Caret from "@/assets/icons/caret.svg";
import { useViewSize } from "@/providers/view-size";
import { scaleVal } from "@/core/utils";

import "./index.scss";

type HTMLHelperProps = { tagName: any; html: string; className?: string; };
const InnerHTMLHelper = forwardRef((({ tagName: Tag, html, className }: HTMLHelperProps, ref) => (
  useMemo(() => <Tag ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />, [html])
)));

const handleMouseEnter = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const gradient = target.querySelector('.gradient') as HTMLElement
  if (!gradient) return
  const buttonRect = target.getBoundingClientRect()
  const x = e.clientX - buttonRect.left
  const y = e.clientY - buttonRect.top

  // Math for the gradient scale
  const maxSideDiff = Math.max(Math.abs(e.clientX - buttonRect.left), Math.abs(e.clientX - buttonRect.right))
  const maxVertTop = buttonRect.height + Math.max(Math.abs(e.clientY - buttonRect.bottom), Math.abs(e.clientY - buttonRect.top))
  const scaleValue = Math.max(maxSideDiff, maxVertTop) / (200 / 2) + .1

  gradient.style.height = `${200}px`
  gradient.style.width = `${200}px`
  gradient.style.left = `${x}px`
  gradient.style.top = `${y}px`
  gradient.style.transform = `translate(-50%, -50%) scale(${scaleValue})`
}
const handleMouseLeave = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const gradient = target.querySelector('.gradient') as HTMLElement
  if (!gradient) return
  const buttonRect = target.getBoundingClientRect()
  
  const x = e.clientX - buttonRect.left
  const y = e.clientY - buttonRect.top

  gradient.style.left = `${x}px`
  gradient.style.top = `${y}px`
  gradient.style.transform = "translate(-50%, -50%) scale(0)"
}

const addClassesToTags = (htmlString: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html')
  doc.querySelectorAll('p').forEach(p => p.classList.add('body'))
  doc.querySelectorAll('a').forEach(a => {
      if (!a.classList.contains('matthews-button')) {
          a.classList.add('blog-link')
      } else {
          a.innerHTML = `
              <span class="uppercase button-text">${a.innerHTML}</span>
              <span class="gradient" />
          `
      }
  })  
  doc.querySelectorAll('img').forEach(img => img.classList.add('blog-image'))
  doc.querySelectorAll('ul').forEach(ul => ul.classList.add('custom-unordered-list'))
  doc.querySelectorAll('ol').forEach(li => li.classList.add('custom-ordered-list'))
  doc.querySelectorAll('blockquote').forEach(blockquote => blockquote.classList.add('custom-blockquote'))
  doc.querySelectorAll('h1').forEach(h1 => h1.classList.add('subtitle-1'))
  doc.querySelectorAll('h2').forEach(h2 => h2.classList.add('subtitle-2'))
  doc.querySelectorAll('h3').forEach(h3 => h3.classList.add('subtitle-3'))

  return doc.body.innerHTML
}

export default function Section(props: BlogSectionProps) {
  const { section_title, section_content, expandable_content, isPageComponent } = props;
  const [showFullContent, setShowFullContent] = useState(false);
  const [modifiedContent, setModifiedContent] = useState("");
  const scrollHeight = useRef(0);
  const scaleHeight = useRef(0);
  const { viewWidth, isMobile } = useViewSize();
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleReadMoreClick = () => {
    setShowFullContent(!showFullContent);
  };  

  useEffect(() => {
    const newContent = addClassesToTags(section_content);
    setModifiedContent(newContent);
  }, []);

  useLayoutEffect(() => {
    if (scrollHeight.current && scaleHeight.current) {  
      gsap.to(containerRef.current, {
        height: showFullContent ? scrollHeight.current : scaleHeight.current,
        duration: 0.5
      });
    }
  }, [showFullContent]);

  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.querySelectorAll("a").forEach((a) => {
        if (a.classList.contains("matthews-button")) {
          a.addEventListener("mouseenter", handleMouseEnter);
          a.addEventListener("mouseleave", handleMouseLeave);
        }
      });
    }
    return () => {
      if (contentRef.current) {
        contentRef.current.querySelectorAll("a").forEach((a) => {
          if (a.classList.contains("matthews-button")) {
            a.removeEventListener("mouseenter", handleMouseEnter);
            a.removeEventListener("mouseleave", handleMouseLeave);
          }
        });
      }
    }
  }, [modifiedContent]);

  useLayoutEffect(() => {
    if (contentRef.current && containerRef.current && viewWidth && expandable_content) {
      scrollHeight.current = contentRef.current.clientHeight;
      scaleHeight.current = isMobile ? 300 : scaleVal(400);
      if (showFullContent) gsap.set(containerRef.current, { height: scrollHeight.current });
      else gsap.set(containerRef.current, { height: scaleHeight.current });
    }
  }, [viewWidth]);

  return (
    <div className={cn("blog-section", { 'blog-section--component': isPageComponent })}>
      <div className="container relative">
        <div className="row">
          <div className="col-md-4 col-lg-3 col-12 title-col">
            <h5 className="display-5 uppercase section-title" dangerouslySetInnerHTML={{ __html: section_title }} />
          </div>
          <div className="col-md-7 col-md-offset-1 col-12 content-col">
            <div ref={containerRef} className={cn("expandable-container", { expanded: showFullContent, 'no-expand': !expandable_content })}>
              <InnerHTMLHelper ref={contentRef} tagName="div" html={modifiedContent} className="expandable" />
              { expandable_content && <div className="gradient-overlay absolute" /> }
            </div>
            { expandable_content &&
              <button
                className="toggle-button d-flex align-center"
                onClick={handleReadMoreClick}
              >
                {showFullContent ? "Show Less" : "Show More"}
                <div className={cn("arrow-button", { clicked: showFullContent})}>
                  <Caret />
                </div>
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
