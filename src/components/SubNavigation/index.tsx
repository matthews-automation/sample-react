"use client";
import React from "react";
import cn from "classnames";
import SubNavButton from "../Buttons/SubNavButton";

import "./index.scss";

export default function SubNavigation(props: {
  guidingText?: string;
  subNavTitle: string;
  links: Array<{ link: ACFLink }>;
  isDetail: boolean;
}) {
  const { guidingText, subNavTitle, links, isDetail } = props;
  return (
    <div className={cn("sub-navigation", { detail: isDetail })}>
      <div className="container">
        <div className="row">
          <div className="sub-navigation__text">
            <span className="sub-navigation__text__more-text" dangerouslySetInnerHTML={{ __html: guidingText! }} />
            <span dangerouslySetInnerHTML={{ __html: subNavTitle }} />
          </div>
          <div className="sub-navigation__buttons">
            {links.map(({ link }, index) => (
              <SubNavButton key={index} url={link.url} label={link.title} variant="light" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
