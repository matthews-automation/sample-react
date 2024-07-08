"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import Caret from "@/assets/icons/caret.svg";
import Close from "@/assets/icons/close.svg";
import Search from "@/assets/icons/search.svg";
import { useViewSize } from "@/providers/view-size";
import { combineTerms } from "@/core/utils";
import AccordionItem from "@/components/AccordionItem";
import IconButton from "@/components/Buttons/IconButton";
import { useOptions } from "@/providers/options";
import emitter from "@/core/EventBus";

import "./index.scss";


type Props = {
  labels: Page["acf"]["filter_labels"];
  formData: FormAPIResponse;
  onClose: () => void;
  onReset: () => void;
  onTypeChange: (type: string) => void;
  onChange: (termSlug: string) => void;
  onApply: (data: ListingFormData) => void;
  onSortChange: (sort: string) => void;
  sort: string;
  types: string[];
  resetActive: boolean;
  searchId: number;
  filterCount: number;
  open: boolean;
};

export default function FiltersDrawer(props: Props) {
  const labels = props.labels!;
  const { filterCount, formData, open, onClose, onReset, searchId, resetActive } = props;
  const [buttonLabel, setButtonLabel] = useState(labels.filter_cta.less);
  const [drawerHeight, setDrawerHeight] = useState(0);
  const [drawerStyle, setDrawerStyle] = useState<React.CSSProperties>({});
  const { viewHeight, viewWidth, isMobile } = useViewSize();
  const params = useSearchParams();
  const [terms, setTerms] = useState<Term[]>([]);
  const [currentSort, setCurrentSort] = useState("recent");
  const { options } = useOptions();
  const [searchableTerms, setSearchableTerms] = useState<Term[]>([]);
  const [formChanged, setFormChanged] = useState(false);
  const [activeTerms, setActiveTerms] = useState<string[]>([params.get("term") || ""].filter(term => term));
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<NodeJS.Timeout | null>(null);
  // todo - add search functionality
  const [_searchedTerms, setSearchedTerms] = useState<Term[]>([]);

  const updateDrawerHeight = () => {
    if (isMobile) {
      setDrawerHeight(0);
      return;
    }
    const target = document.querySelector(".listing-page");
    if (!target) return;
    const { height } = target.getBoundingClientRect();
    if (height !== drawerHeight) setDrawerHeight(height);
  }

  const handleTermClick = (term: Term, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMobile) props.onChange(term.slug);
    else setFormChanged(true);
    if (activeTerms.includes(term.slug)) setActiveTerms(activeTerms.filter(t => t !== term.slug));
    else setActiveTerms([...activeTerms, term.slug]);
  };
  const handleTypeClick = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMobile) props.onTypeChange(type);
    else setFormChanged(true);
    if (activeTypes.includes(type)) setActiveTypes(activeTypes.filter(t => t !== type));
    else setActiveTypes([...activeTypes, type]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredTerms = searchableTerms.filter(term => term.name.toLowerCase().includes(value));
    setSearchedTerms(filteredTerms);
  };

  const handleReset = () => {
    setActiveTerms([]);
    setActiveTypes([]);
    setCurrentSort("recent");
    if (isMobile) onClose();
    onReset();
  };

  const handleApply = () => {
    props.onApply({ sort: currentSort, terms: activeTerms, type: activeTypes });
    onClose();
    setFormChanged(false);
  };

  const handleResize = () => {
    if (resizeRef.current) clearTimeout(resizeRef.current);
    setIsResizing(true);
    resizeRef.current = setTimeout(() => { setIsResizing(false); }, 100);
  }

  const handleSortChange = (sort: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSort(sort);
    setFormChanged(true);
  };

  const handleTagClick = (term: Term) => {
    setActiveTerms([term.slug]);
  };

  useEffect(() => {
    const replace = filterCount > 0 ? `(${filterCount.toString()})` : '';
    const more = labels.filter_cta.less.replace('{{COUNT}}', replace);
    setButtonLabel(more);
  }, [filterCount]);

  useLayoutEffect(() => {
    if (drawerHeight) {
      setDrawerStyle({ minHeight: `${drawerHeight}px` });
    } else {
      setDrawerStyle({});
    }
  }, [drawerHeight]);

  useEffect(() => {
    emitter.on("TAG_CLICK", handleTagClick);
    return () => emitter.off("TAG_CLICK", handleTagClick);
  }, []);

  useEffect(() =>  {
    const combinedTerms = combineTerms(formData.terms);
    const searchableTerms = [...combinedTerms].map(term => {
      if (term.displayChildren) return term.displayChildren;
      return term.children || [];
    }).flat();
    setSearchableTerms(searchableTerms);
    setTerms(combinedTerms);
  }, [formData]);

  useEffect(() => {
    if (props.sort !== currentSort) setCurrentSort(props.sort);
  }, [props.sort]);

  useEffect(() => {
    if (props.types !== activeTypes) setActiveTypes(props.types);
  }, [props.types]);

  useLayoutEffect(() => {
    updateDrawerHeight();
    handleResize();
  }, [viewHeight, viewWidth, searchId]);
  return (
    <div className={cn("filters-drawer", { open, resize: isResizing })} style={drawerStyle}>
      <button className="filter-button drawer" onClick={onClose}>
        <span className="icon"><Caret /></span>
        <p className="body-small" dangerouslySetInnerHTML={{ __html: buttonLabel }}/>
      </button>
      <div className="filters-drawer__modal-header">
        <h3 className="subtitle-3" dangerouslySetInnerHTML={{ __html: labels.filter_modal_label }} />
        <IconButton icon={Close} onClick={onClose} />
      </div>
      <div className="search">
        <label className="search__wrapper">
          <input
            type="text"
            className="search__input body-small"
            onChange={handleInputChange}
            placeholder={options.search_keywords_label}
          />
          <span className="icon"><Search /></span>
        </label>
      </div>
      <div className="filters-drawer__accordions">
        {terms.map(term => {
          const children = term.displayChildren ? term.displayChildren : term.children ? term.children : [];
          return (
            <AccordionItem key={term.term_id} title={term.name} single>
              <div className="term-accordion-content">
                {
                  children.map(child => {
                    return (
                      <button
                        key={child.term_id}
                        className={cn("term-accordion-button body-small", activeTerms.includes(child.slug) && "active")}
                        onClick={(e) => handleTermClick(child, e)}
                        dangerouslySetInnerHTML={{ __html: child.name }}
                      />
                    )
                  })
                }
              </div>
            </AccordionItem>
          )
        })}
        <div className="content-type">
          <AccordionItem title={labels.content_type_label} single>
            <div className="term-accordion-content">
              <button
                className={cn("term-accordion-button body-small", activeTypes.includes("post") && "active")}
                onClick={(e) => handleTypeClick("post", e)}
                dangerouslySetInnerHTML={{ __html: options.blog_post_label }}
              />
              {formData.types.map(type => (
                <button
                  key={type.name}
                  className={cn("term-accordion-button body-small", activeTypes.includes(type.name) && "active")}
                  onClick={(e) => handleTypeClick(type.name, e)}
                  dangerouslySetInnerHTML={{ __html: type.label }}
                />
              ))}
            </div>
          </AccordionItem>
        </div>
        <div className="sort-by">
        <AccordionItem title={labels.sort_by_label} single>
          <div className="term-accordion-content">
            {Object.entries(labels.sort_by_option_labels).map(([key, value]) => (
              <button
                key={key}
                className={cn("term-accordion-button body-small radio", currentSort === key && "active")}
                onClick={(e) => handleSortChange(key, e)}
                >
                  <span className="body-small" dangerouslySetInnerHTML={{ __html: value }} />
                  <span className="circle" />
                </button>
            ))}
          </div>
        </AccordionItem>
        </div>
      </div>
      <div className="filters-drawer__bottom">
        <button className={cn("reset-button", !resetActive && "disabled")} onClick={handleReset} dangerouslySetInnerHTML={{ __html: labels.clear_all_label }} />
        <button
          onClick={handleApply}
          className="apply-button"
          dangerouslySetInnerHTML={{ __html: labels.apply_button_label }}
          disabled={!formChanged}
        />
      </div>
    </div>
  )
}