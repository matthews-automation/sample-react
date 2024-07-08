"use client";
import cn from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useParams } from "next/navigation";
import { useRouter } from "@/navigation";
import emitter from "@/core/EventBus";
import { chunkArrayEvenly } from "@/core/utils";
import Close from "@/assets/icons/close.svg";

import "./index.scss";

export default function LanguageSelector(props: LanguageSelectorProps) {
  const { languages, label } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { locale } = useParams();
  const languageChunks = chunkArrayEvenly(languages, 6);
  const router = useRouter();

  const handleShowLangSelector = (show: boolean) => {
    setVisible(show);
  };

  const handleCountryChange = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    setVisible(false);
    // TODO: update to desired behavior - MA
    if (code !== locale) router.push('/', { locale: code });
  };

  const checkClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setVisible(false);
  };

  useLayoutEffect(() => {
    document.body.classList.toggle("locked", visible);
  }, [visible]);

  useEffect(() => {
    emitter.on("SHOW_LANG_SELECTOR", handleShowLangSelector);
    return () => emitter.off("SHOW_LANG_SELECTOR", handleShowLangSelector);
  }, []);
  return (
    <CSSTransition
      in={visible}
      nodeRef={nodeRef}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="language-select" ref={nodeRef} onClick={checkClose}>
        <div className="language-select__content" style={{ '--chunk-count': languageChunks.length } as React.CSSProperties}>
          <div className="header-row">
            <p className="eyebrow" dangerouslySetInnerHTML={{ __html: label }} />
            <hr />
            <button className="header-row__close" onClick={() => setVisible(false)}>
              <Close />
            </button>
          </div>
          <div className="country-list">
            {languageChunks.map((chunk, i) => (
              <div className="column" key={i}>
                { chunk.map((lang, j) => (
                  <button
                    className={cn("subtitle-5 country-button", { active: lang.code === locale })}
                    key={lang.code}
                    onClick={(e) => handleCountryChange(e, lang.code)}
                    dangerouslySetInnerHTML={{ __html: lang.native_name }} 
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}