"use client";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useViewSize } from "@/providers/view-size";
import Pagination from "@/components/Pagination";
import InsightCard from "@/components/InsightCard";
import emitter from "@/core/EventBus";

import "./index.scss";

type props = {
  labels: Page["acf"]["filter_labels"];
  cards: Insight[];
  open: boolean;
  page: number;
  maxPage: number;
  handlePageChange: (newPage: number) => void;
  formData: FormAPIResponse;
};

export default function ListingPageGrid(props: props) {
  const labels = props.labels!;
  const { cards, open, page, maxPage, handlePageChange, formData } = props;
  const { viewWidth, isDesktop, isTablet, isDesktopLarge, isMobile } =
    useViewSize();
  const rowRef = useRef<HTMLDivElement>(null);
  const [cardStyle, setCardStyle] = useState({});
  const [cardWidth, setCardWidth] = useState(0);
  const getCardWidth = () => {
    const target = document.querySelector(".listing-page-grid__row");
    if (isMobile) {
      setCardStyle({ width: "50%" });
      gsap.set(".filters-drawer", { clearProps: "width" });
    } else if (target) {
      const { width } = target.getBoundingClientRect();
      const cardsPerRow = isDesktop ? 4 : isTablet ? 3 : 2;
      const elWidth = Math.floor(width / cardsPerRow);
      setCardWidth(elWidth);
      gsap.set(".filters-drawer", { width: elWidth });
      setCardStyle({ width: elWidth });
      if (open) gsap.set(rowRef.current, { paddingLeft: elWidth });
    }
  };

  const handleTagClick = (term: Term) => {
    emitter.emit("TAG_CLICK", term);
  };
  useLayoutEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("authenticMotion", ".4, 0, .2, 1");
  }, []);
  useLayoutEffect(() => {
    getCardWidth();
  }, [viewWidth]);
  useLayoutEffect(() => {
    if (isMobile) return;
    if (open) {
      gsap.to(rowRef.current, {
        paddingLeft: cardWidth,
        duration: 0.4,
        ease: "authenticMotion",
      });
    } else {
      gsap.to(rowRef.current, {
        paddingLeft: 0,
        duration: 0.4,
        ease: "authenticMotion",
      });
    }
  }, [open]);
  return (
    <div className="listing-page-grid">
      <div className="listing-page-grid__row" ref={rowRef}>
        {cards.length ? (
          <>
            {cards.map((card) => (
              <InsightCard
                key={card.id}
                insight={card}
                cardStyle={cardStyle}
                onTagClick={handleTagClick}
                formData={formData}
              />
            ))}
            <Pagination
              page={page}
              maxPage={maxPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="no-results">
            <div className="copy">
              <p className="eyebrow" dangerouslySetInnerHTML={{ __html: labels.no_results_eyebrow }} />
              <p className="subtitle-5" dangerouslySetInnerHTML={{ __html: labels.no_results_body }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
