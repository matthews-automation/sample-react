"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import cn from "classnames";
import ListingPageForm from "./Form";
import ListingPageGrid from "./Grid";
import { areObjectsEqual } from "@/core/utils";
import { useScroll } from "@/providers/scroll-pos";
import { useOptions } from "@/providers/options";
import { useViewSize } from "@/providers/view-size";
import Caret from "@/assets/icons/caret.svg";
import emitter from "@/core/EventBus";
import api from "@/core/api";

import "./index.scss";

export default function ListingPage(props: {
  content: Page;
  initialData: InsightsAPIResponse;
  formData: FormAPIResponse;
}) {
  const {
    content: { acf },
    initialData,
    formData,
  } = props;

  const [cardsData, setCardsData] = useState(initialData.insights);
  const params = useSearchParams();
  const initialSearch = { sort: "recent", terms: [params.get("term") || ""].filter(term => term)};
  const [filters, setFilters] = useState<ListingFormData>(initialSearch);
  const lastFilters = useRef<ListingFormData>(filters);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchId, setSearchId] = useState(0);
  const [rootBottom, setRootBotttom] = useState(0);
  const [resetActive, setResetActive] = useState(false);
  const [rootTop, setRootTop] = useState(0);
  const [hideFloatingButton, setHideFloatingButton] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { options } = useOptions();
  const lastPage = useRef(page);
  const [filterCount, setFilterCount] = useState(filters.terms?.length || 0);
  const [maxPage, setMaxPage] = useState(initialData.max_num_pages);
  const { locale } = useParams();
  const { scrollPos } = useScroll();
  const { viewWidth, viewHeight } = useViewSize();

  const handleFormChange = async (data: ListingFormData) => {
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === "" || (Array.isArray(value) && value.length === 0)) return acc;
      acc[key] = Array.isArray(value) ? value.join(",") : value;
      return acc;
    }, {} as ListingFormData);
    if (areObjectsEqual(cleanedData, filters)) return;
    if (data.terms) setFilterCount(data.terms.length);
    else setFilterCount(0);
    setPage(1);
    setFilters({ ...cleanedData });
  };

  const fetchInsights = async () => {
    setIsLoading(true);
    api.getInsights(locale as string, { ...filters, page }).then((res) => {
      if (!res) return;
      setCardsData(res.insights);
      setIsLoading(false);
      setMaxPage(res.max_num_pages);
      setSearchId(Date.now());
      lastFilters.current = filters;
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleTagClick = (term: Term) => {
    setFilters({ ...filters, terms: [term.slug] });
  };

  const handleDrawerChange = (open: boolean) => {
    if (drawerOpen !== open) setDrawerOpen(open);
  };

  const handleDrawerOpen = () => {
    document.body.classList.toggle("locked");
    emitter.emit("HIDE_HEADER", true);
    setDrawerOpen(true);
  };

  useEffect(() => {
    if (areObjectsEqual(filters, lastFilters.current) && lastPage.current === page) return;
    lastFilters.current = filters;
    lastPage.current = page;
    setResetActive(!areObjectsEqual(filters, initialSearch));
    fetchInsights();
  }, [filters, page]);

  useLayoutEffect(() => {
    if (scrollPos + viewHeight > rootBottom && !hideFloatingButton) setHideFloatingButton(true);
    else if (scrollPos + viewHeight < rootBottom && hideFloatingButton) setHideFloatingButton(false);

    if (scrollPos > rootTop && !showFloatingButton) setShowFloatingButton(true);
    else if (scrollPos < rootTop && setShowFloatingButton) setShowFloatingButton(false);
  }, [scrollPos]);

  useLayoutEffect(() => {
    if (rootRef.current && viewWidth && viewHeight) {
      const { height, top } = rootRef.current.getBoundingClientRect();
      setRootBotttom(height + top + scrollPos - 120);
      setRootTop(top + scrollPos - (viewHeight * 0.75));
    }
  }, [viewWidth, viewHeight, searchId]);

  return (
    <div className={cn("listing-page", isLoading && "loading")} ref={rootRef}>
      <div
        className={cn(
          "floating-button",
          {
            hide: hideFloatingButton && cardsData.length > 0,
            visible: showFloatingButton,
            noCards: cardsData.length === 0,
          },
        )}
      >
        <button
          className="filter-button floating"
          onClick={handleDrawerOpen}
        >
          <p dangerouslySetInnerHTML={{ __html: acf.filter_labels!.filter_modal_label }} />
          <span className="icon">
            <Caret />
          </span>
        </button>
      </div>
      <div className="container">
        <ListingPageForm
          searchId={searchId}
          onDrawerChange={handleDrawerChange}
          open={drawerOpen}
          filterCount={filterCount}
          resetActive={resetActive}
          formData={formData}
          labels={acf.filter_labels!}
          onChange={handleFormChange}
        />
        <ListingPageGrid
          cards={cardsData}
          open={drawerOpen}
          formData={formData}
          page={page}
          maxPage={maxPage}
          handlePageChange={handlePageChange}
          labels={acf.filter_labels!}
        />
      </div>
    </div>
  );
}
