"use client";
import { useRef, useState } from "react";
import cn from "classnames";
import Caret from "@/assets/icons/tab-button-caret.svg";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import "./index.scss";

type Props = {
  tabs: { desktop: string; mobile: string; }[];
  children: React.ReactNode[];
};

export default function Tabs(props: Props) {
  const { tabs, children } = props;
  if (tabs.length !== children.length) return "Error: Tabs and children must be the same length";
  const nodeRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs">
      <div className="tabs__tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={cn("tabs__tab-buttons__button button-small", {
              active: activeTab === index,
            })}
            onClick={() => setActiveTab(index)}
          >
            <span className="desktop" dangerouslySetInnerHTML={{ __html: tab.desktop }}/>
            <span className="mobile" dangerouslySetInnerHTML={{ __html: tab.mobile }}/>
            <Caret />
          </button>
        ))}
      </div>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={activeTab}
          nodeRef={nodeRef}
          classNames="fade"
          addEndListener={(done) => nodeRef.current!.addEventListener("transitionend", done, false)}
        >
          <div className="tabs__tab-content" ref={nodeRef}>
            {children[activeTab]}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}
