"use client";
import "./index.scss";
import { useRef } from "react";
import { useScroll } from "@/providers/scroll-pos";
import Link from "next/link";
import { parseLink } from "@/core/utils";

export default function SecondaryButton(props: ButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { url, onClick , label } = props;
  const gradientSize = 100;
  const { isTouch } = useScroll();
  const TagName = onClick ? "button" : Link;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isTouch) return;
    if (!buttonRef.current) return;
    const target = e.target as HTMLElement;
    const buttonRect = target.getBoundingClientRect();
    const x = e.clientX - buttonRect.left;
    const y = e.clientY - buttonRect.top;

    // Math for the gradient scale
    const maxSideDiff = Math.max(Math.abs(e.clientX - buttonRect.left), Math.abs(e.clientX - buttonRect.right));
    const maxVertTop = buttonRect.height + Math.max(Math.abs(e.clientY - buttonRect.bottom), Math.abs(e.clientY - buttonRect.top));
    const scaleValue = Math.max(maxSideDiff, maxVertTop) / (gradientSize / 2) + .1;

    buttonRef.current.style.height = `${gradientSize}px`;
    buttonRef.current.style.width = `${gradientSize}px`;
    buttonRef.current.style.left = `${x}px`;
    buttonRef.current.style.top = `${y}px`;
    buttonRef.current.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const target = e.target as HTMLElement;
    const buttonRect = target.getBoundingClientRect();
    
    const x = e.clientX - buttonRect.left;
    const y = e.clientY - buttonRect.top;

    buttonRef.current.style.left = `${x}px`;
    buttonRef.current.style.top = `${y}px`;
    buttonRef.current.style.transform = "translate(-50%, -50%) scale(0)";
  };

  const tagProps: any = { className: "button-secondary-container", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave};
  if (onClick) tagProps['onClick'] = onClick;
  else if (url) tagProps['href'] = parseLink(url);

  return (
    <>
      <TagName {...tagProps}>
        <span className="uppercase button-text"  dangerouslySetInnerHTML={{ __html: label }} />
        <div className="gradient" ref={buttonRef} />
      </TagName>
    </>
  );
}