"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import cn from "classnames";
import { Link } from "@/navigation";
import Logo from "@/assets/icons/logo.svg";
import Search from "@/assets/icons/search.svg";
import Country from "@/assets/icons/country.svg";
import { parseLink, parseMenuChunks, parseMenuItems } from "@/core/utils";
import { useScroll } from "@/providers/scroll-pos";
import { useActivePage } from "@/providers/active-page";
import { useViewSize } from "@/providers/view-size";
import DesktopMenu from "./Desktop";
import MobileMenu from "./Mobile";
import GradientButton from "../Buttons/GradientButton";
import emitter from "@/core/EventBus";

import "./index.scss";

export default function Header(props: HeaderProps) {
  const { items, options, social_urls, showLangSelector } = props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hide, setHide] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuItems = parseMenuItems(items);
  const { scrollPos, direction } = useScroll();
  const desktopChunks = parseMenuChunks(menuItems);
  const lastScroll = useRef(0);
  const { headerLight } = useActivePage();
  const { isDesktop, viewWidth, isMobile } = useViewSize();
  const scrollLimit = useMemo(() => {
    if (isDesktop) return 20;
    if (isMobile) return 50;
    return 40;
  }, [viewWidth, isDesktop])
  const handleMobileClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.classList.toggle("locked");
  };
  const handleMobileLinkClick = () => {
    if (!mobileMenuOpen) return;
    setMobileMenuOpen(false);
    document.body.classList.remove("locked");
  };

  const onDesktopOpen = (id: number) => { setDesktopMenuOpen(id); };
  const handleCountryClick = () => { emitter.emit("SHOW_LANG_SELECTOR", true); };

  const onHideHeader = (hide: boolean) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    if (hide) {
      gsap.set(headerRef.current, { transition: 'none' });
      gsap.to(headerRef.current, { y: -80 + rect.top, duration: 0.5, ease: "power2.inOut" });
    } else {
      gsap.to(headerRef.current, { y: 0, duration: 0.5, ease: "power2.inOut", onComplete: () => { gsap.set(headerRef.current, { clearProps: 'all' }) }});
    }
  };
  useLayoutEffect(() => {
    if (direction === "down" && scrollPos > lastScroll.current + scrollLimit) {
      setVisible(false);
      setHide(true);
      lastScroll.current = Math.max(0, scrollPos);
    } else if (direction === "up" && scrollPos < lastScroll.current - scrollLimit) {
      setVisible(true);
      setHide(false);
      lastScroll.current = Math.max(0, scrollPos);
    }

    if (!scrolled && scrollPos > scrollLimit) {
      setTimeout(() => {
        setScrolled(true);
      }, 300);
    } else if (scrolled && scrollPos < 10) {
      setScrolled(false);
    }
  }, [scrollPos]);
  useEffect(() => {
    emitter.on("HIDE_HEADER", onHideHeader);
    return () => {
      emitter.off("HIDE_HEADER", onHideHeader);
    }
  }, []);

  return (
    <nav className={cn("header", (desktopMenuOpen || mobileMenuOpen) && "hovered", headerLight && 'light', { hide, visible, scrolled })} ref={headerRef}>
      <div className="container">
        <div className="row justify-between header--row">
          <Link href="/" className="logo" onClick={handleMobileLinkClick}>
            <Logo className="logo__icon" />
          </Link>
          {items && <DesktopMenu items={desktopChunks} visible={!!desktopMenuOpen} onOpen={onDesktopOpen} />}
          <div className="header__buttons">
            { showLangSelector && 
              <button className="country-button" onClick={handleCountryClick}>
                <Country />
              </button>
            }
            <Link href={parseLink(options.search_link)} className="search-button" aria-label="search">
              <Search />
            </Link>
            { options?.header_button && (
                <GradientButton url={parseLink(options.header_button.url)} label={options.header_button.title} />
            )}
            <button
              className={cn("mobile-menu-button", mobileMenuOpen && "is-active")}
              onClick={handleMobileClick}
            >
              <div className="mobile-menu-button__box">
                <div className="mobile-menu-button__inner"></div>
              </div>
            </button>
          </div>
        </div>
        {items && ( <MobileMenu items={menuItems} visible={mobileMenuOpen} social_urls={social_urls} onLinkClick={handleMobileLinkClick} headerButton={options.header_button}/> )}
      </div>
    </nav>
  );
}
