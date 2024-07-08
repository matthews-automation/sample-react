"use client";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import ArrowRight from "@/assets/icons/right-arrow.svg";
import { useScroll } from "@/providers/scroll-pos";
import SubNavButton from "@/components/Buttons/SubNavButton";
import { parseLink } from "@/core/utils";
import { useActivePage } from "@/providers/active-page";

import "./index.scss";

export default function DesktopMenu(props: {
  items: MenuItem[];
  visible: boolean;
  onOpen: (id: number) => void;
  }) {
    const { items } = props;
    const [activeMenu, setActiveMenu] = useState(0);
    const subMenuRefs = useRef<{ [key: string]: HTMLDivElement | null}>({});
    const [hovered, setHovered] = useState(0);
    const prevHovered = useRef(0);
    const { scrollPos, direction } = useScroll();
    const [activeHeight, setActiveHeight] = useState({ });
    const [showBg, setShowBg] = useState(false);
    const [highlightedMenuItem, setHighlightedMenuItem] = useState<string | null>(null);
    const { activePage } = useActivePage();
    const router = useRouter();
    let bgTimeout: NodeJS.Timeout;

    const handleMenuClick = (link: string) => {
      const parsedLink = parseLink(link);
      router.push(parsedLink);
      handleMouseLeave();
    }

    const handleMouseEnter = (id: number) => {
      const nextHeight = subMenuRefs.current[id]?.clientHeight || 0;
      const prevHeight = subMenuRefs.current[prevHovered.current]?.clientHeight || 0;
      const height = Math.min(nextHeight, prevHeight) || 0;
      setActiveHeight({ height: `${height}px` });
      props.onOpen(id);
      setHovered(id);
      prevHovered.current = id;
    }
    const handleMouseLeave = () => {
      setHovered(0);
      props.onOpen(0);
    }
    const setRef = (id: number, ref: HTMLDivElement | null) => {
      subMenuRefs.current[id] = ref;
    }

    useEffect(() => {
      let active: string | null = null;
      items.forEach((item) => {
        const objId = item.object_id;
        if (parseInt(item.object_id) === activePage) active = objId;
        item.children?.forEach((child) => {
          if (parseInt(child.object_id) === activePage) active = objId;
          if (child.children) {
            child.children.forEach((subChild) => {
              if (parseInt(subChild.object_id) === activePage) active = objId;
            });
          }
        });
      });
      if (active) setHighlightedMenuItem(active);
      else setHighlightedMenuItem(null);
    }, [activePage]); 

    useEffect(() => {
      if (bgTimeout) clearTimeout(bgTimeout);
      if (!hovered) setActiveHeight({});
      bgTimeout = setTimeout(() => {
        if (!hovered) {
          prevHovered.current = 0;
          setShowBg(false);
        }
        else setShowBg(true);
      }, 400);
    }, [hovered]);

    useEffect(() => {
      if (direction === "down" && scrollPos > 80 && hovered) {
        handleMouseLeave();
      }
    }, [scrollPos]);
    
    return (
      <div className="desktop-menu">
        <ul className="desktop-menu__items d-flex align-center">
          {items.map((item) => (
            <li
              key={item.ID}
              className="desktop-menu__items__item"
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn('body', 'body-small', item.ID, { 'hovered': hovered === item.ID, 'active': highlightedMenuItem === item.object_id })}
                onClick={() => handleMenuClick(item.url)}
                onMouseEnter={() => handleMouseEnter(item.ID)}  
              >
                <span dangerouslySetInnerHTML={{ __html: item.title }} />
              </button>
              { showBg && <div className="desktop-menu__sub-bg" style={activeHeight} /> }
              <div className={cn('desktop-menu__sub-menu', hovered === item.ID && 'visible')} ref={(el) => setRef(item.ID, el)}>
                <div className="container">
                  <div className="row">
                    <ul className="desktop-menu__sub-menu__items d-flex">
                      {item.children?.map((child) => (
                        <li key={child.ID} className="desktop-menu__sub-menu__items__item">
                          <div className="item-heading">
                            <p className="eyebrow" dangerouslySetInnerHTML={{ __html: child.title }} />
                            <span className="line" />
                          </div>
                          <div className="item-links">
                            {child.children && !Array.isArray(child.children[0]) && child.children.map((subChild) => {
                              return (
                                <Link key={subChild.ID} className="desktop-link" href={parseLink(subChild.url)} onClick={handleMouseLeave}>
                                  <span className="subtitle-5" dangerouslySetInnerHTML={{ __html: subChild.title}} />
                                  {/* <ArrowRight className="desktop-link__arrow" /> */}
                                </Link>
                              )
                            })}
                            {child.children && Array.isArray(child.children[0]) && (
                              <div className="item-links__chunks">
                                {child.children.map((subChild, index: number) => (
                                  <div className="item-links__chunks__chunk" key={`menu-chunk--${index}`}>
                                    {(subChild as unknown as MenuItem[]).map((subChildLink) => (
                                      <Link key={subChildLink.ID} className="desktop-link" href={parseLink(subChildLink.url)} onClick={handleMouseLeave}>
                                        <span className="subtitle-5" dangerouslySetInnerHTML={{ __html: subChildLink.title }} />
                                        {/* <ArrowRight className="desktop-link__arrow" /> */}
                                      </Link>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    {item.button && (
                      <div className="desktop-menu__sub-menu__button" onClick={handleMouseLeave}>
                        <SubNavButton url={item.button.url} label={item.button.title} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
