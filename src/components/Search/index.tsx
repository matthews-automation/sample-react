"use client";
import { useRef, useState } from "react";
import cn from "classnames";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import SearchResults from "./SearchResults";
import Pagination from "../Pagination";
import api from "@/core/api";
import SearchIcon from "@/assets/icons/search.svg";
import CloseIcon from "@/assets/icons/close.svg";
import { useScroll } from "@/providers/scroll-pos";
import { HEADER_HEIGHT } from "@/core/constants";

import "./index.scss";

export default function Search({
  headline,
  body,
  search_placeholder,
  keywords_title,
  frequently_searched,
  locale,
  search_results_count_label,
  no_results
}: SearchPage) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [prevSearchTerm, setPrevSearchTerm] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const searched = useRef(false);
  const page = useRef(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const { scrollPos } = useScroll();
  gsap.registerPlugin(ScrollToPlugin);

  const handleTagClick = (keyword: string) => {
    setSearchTerm(keyword);
    fetchSearchResults(keyword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    searched.current = false;
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    console.log(e);
    if (searched.current) {
      setSearchTerm("");
      searched.current = false;
    } else {
      handleFormSubmit();
    }
  };

  const handlePageChange = async (newPage: number) => {
    const searchResultsTop = searchRef.current?.getBoundingClientRect().top;
    if (searchResultsTop === undefined) return;
    // TODO - Fix header height
    gsap.to(window, { scrollTo: searchResultsTop + scrollPos - HEADER_HEIGHT, duration: 0.5 });
    page.current = newPage;
    fetchSearchResults();
  };

  const fetchSearchResults = (term?: string) => {
    setSearchLoading(true);
    api.getSearchResults(locale, { query: term || searchTerm, page: page.current }).then((data) => {
      setSearchId(data.search_id);
      setMaxPage(data.max_num_pages);
      setSearchResults(data.results);
      setCurrentPage(page.current);
      setCount(data.total);
      searched.current = true;
      setTimeout(() => { setSearchLoading(false); }, 350); // Delay to allow for transition between loading states - MA
    });
  };

  const handleFormSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!searchTerm || searched.current || prevSearchTerm === searchTerm) return;
    setPrevSearchTerm(searchTerm);
    page.current = 1;
    fetchSearchResults();
  };

  return (
    <div className="search">
      <div className="container">
        <div className="row justify-center">
          <div className="col-12 text-center search__header">
            <h1 className="display-5" dangerouslySetInnerHTML={{ __html: headline }} />
            <p className="body" dangerouslySetInnerHTML={{ __html: body }} />
          </div>
          <div className="col-12">
            <form onSubmit={handleFormSubmit}>
              <div className="search__input">
                <input type="text" placeholder={search_placeholder} onChange={handleInputChange} value={searchTerm} />
                <button
                  className={cn("search__input__button", { disabled: !searchTerm, searched: searched.current })}
                  aria-label="search"
                  type="button"
                  onClick={handleButtonClick}
                >
                  <SearchIcon />
                  <CloseIcon className="close" />
                </button>
              </div>
            </form>
          </div>
          <div className={cn("search__search", { loading: searchLoading })} ref={searchRef}>
            <>
            
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={`${searchId}-${currentPage}`}
                  nodeRef={nodeRef}
                  classNames="fade"
                  addEndListener={(done) =>
                    nodeRef.current!.addEventListener("transitionend", done, false)
                  }
                >
                  <div
                    className={"search__content justify-center text-center"}
                    ref={nodeRef}
                  >
                    {!searchId ? (
                      <div className="search__keywords">
                        <h2
                          className="body"
                          dangerouslySetInnerHTML={{ __html: keywords_title }}
                        />
                        {
                          <ul className="search__keywords__buttons">
                            {frequently_searched.map(keyword => (
                              <li key={keyword.keyword}>
                                <button
                                  className="tag"
                                  onClick={() => handleTagClick(keyword.keyword)}
                                  dangerouslySetInnerHTML={{
                                    __html: keyword.keyword,
                                  }}
                                />
                              </li>
                            ))}
                          </ul>
                        }
                      </div>
                    ) : (
                      <>
                        <SearchResults
                          items={searchResults}
                          label={search_results_count_label}
                          count={count}
                          no_results_label={no_results}
                        />
                        { count ? <Pagination page={page.current} maxPage={maxPage} onPageChange={handlePageChange} />  : null }
                      </>
                    )}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
