import Link from "next/link";
import { useEffect, useState } from "react";
import cn from "classnames";
import ArrowRight from "@/assets/icons/right-arrow.svg";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import Facebook from "@/assets/icons/facebook.svg";
import Instagram from "@/assets/icons/instagram.svg";
import Linkedin from "@/assets/icons/linkedin.svg";
import IconButton from "@/components/Buttons/IconButton";
import AccordionItem from "@/components/AccordionItem";
import SubNavButton from "@/components/Buttons/SubNavButton";

import "./index.scss";
import { parseLink } from "@/core/utils";

export default function MobileMenu(props: {
  items: MenuItem[];
  visible: boolean;
  social_urls: { instagram_url: string; linkedin_url: string; facebook_url: string };
  onLinkClick: () => void;
  headerButton?: ACFLink;
}) {
  const { items, visible, social_urls, onLinkClick, headerButton } = props;
  const [activeMenu, setActiveMenu] = useState(0);
  const { instagram_url, linkedin_url, facebook_url } = social_urls;
  const handleMenuClick = (id: number) => {
    setActiveMenu(id);
  };
  const handleMenuClose = () => {
    setActiveMenu(0);
  };
  useEffect(() => {
    if (!visible && activeMenu !== 0) {
      setTimeout(() => {
        setActiveMenu(0);
      }, 400);
    }
  }, [visible]);
  return (
    <div className={cn("mobile-menu", visible && "visible")}>
      <div className={cn("mobile-menu__screen", activeMenu && "active")}>
        <ul className="mobile-menu__screen__items">
          {items.map((item) => (
            <li key={item.ID} className="mobile-menu__screen__items__item">
              <button
                className="subtitle-3"
                onClick={() => handleMenuClick(item.ID)}
              >
                <span dangerouslySetInnerHTML={{ __html: item.title }} />
                <span className="arrow">
                  <ArrowRight />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mobile-menu__screen__bottom">
          <div onClick={onLinkClick}>
            <SecondaryButton url={headerButton?.url} label={headerButton?.title || "Get in Touch"}/>
          </div>
          <div className="mobile-menu__screen__bottom__social">
            <p className="eyebrow">Find Us</p>
            <div className="d-flex social-links">
              <a href={linkedin_url} target="_blank">
                <Linkedin />
              </a>
              <a href={facebook_url} target="_blank">
                <Facebook />
              </a>
              <a href={instagram_url} target="_blank">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
      </div>
      {items.map((item) => (
        <div
          className={cn(
            "mobile-menu__sub-screen",
            activeMenu === item.ID && "active"
          )}
          key={item.ID}
        >
          <div className="mobile-menu__sub-screen__title">
            <IconButton icon={ArrowRight} onClick={handleMenuClose} flip />
            <p className="subtitle-3" dangerouslySetInnerHTML={{ __html: item.title }}/>
          </div>
          <ul className="mobile-menu__sub-screen__items">
            {item.children?.map((category: any) => (
              <li
                  key={category.ID}
                  className="mobile-menu__sub-screen__items__item"
              >
                <AccordionItem menuTitle={category.title} single>
                  <div className="accordion-links">
                    {category.children?.map((link: any) => (
                      <Link
                        href={parseLink(link.url)}
                        className="subtitle-5"
                        onClick={onLinkClick}
                        key={link.ID}
                        dangerouslySetInnerHTML={{ __html: link.title }}
                      /> 
                    ))}
                  </div>
                </AccordionItem>
              </li>
            ))}
            {item.button && (
              <li className="mobile-menu__sub-screen__items__item bottom-button" onClick={onLinkClick}>
                <SubNavButton url={item.button.url} label={item.button.title} />
              </li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
