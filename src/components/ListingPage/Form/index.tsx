"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import Caret from "@/assets/icons/caret.svg";
import Select from "@/components/Form/Select";
import FiltersDrawer from "./FiltersDrawer";
import { useViewSize } from "@/providers/view-size";
import emitter from "@/core/EventBus";
import { useOptions } from "@/providers/options";

import "./index.scss";

type Props = {
  labels: Page["acf"]["filter_labels"];
  formData: FormAPIResponse;
  onChange: (data: ListingFormData) => void;
  open: boolean;
  onDrawerChange: (open: boolean) => void;
  searchId: number;
  resetActive: boolean;
  filterCount: number;
};

export default function ListingPageForm(props: Props) {
  const labels = props.labels!;
  const { filterCount, formData, onDrawerChange, searchId, open, resetActive } = props;
  const selectOptions = [
    { value: "recent", label: labels.sort_by_option_labels.recent },
    { value: "title_a_z", label: labels.sort_by_option_labels.title_a_z },
    { value: "title_z_a", label: labels.sort_by_option_labels.title_z_a },
  ];
  const { options } = useOptions();
  const { isMobile } = useViewSize();
  const [buttonLabel, setButtonLabel] = useState(labels.filter_cta.more);
  const params = useSearchParams();
  const [types, setTypes] = useState<string[]>([]);
  const [sort, setSort] = useState("recent");
  const [terms, setTerms] = useState<string[]>([params.get("term") || ""].filter(term => term));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleTypeChange = (type: string) => {
    if (types.includes(type)) setTypes(types.filter((t) => t !== type));
    else setTypes([...types, type]);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const handleTermChange = (termSlug: string) => {
    if (terms.includes(termSlug)) setTerms(terms.filter((t) => t !== termSlug));
    else setTerms([...terms, termSlug]);
  };

  const handleClose = () => {
    if (isMobile) {
      document.body.classList.toggle("locked");
      emitter.emit("HIDE_HEADER", false);
    }
    setDrawerOpen(false);
  }
  const handleReset = () => {
    setSort("recent");
    setTypes([]);
    setTerms([]);
    if (isMobile) props.onChange({ type: types, sort, terms });
  }

  const handleMobileApply = ({ type, sort, terms }: ListingFormData) => {
    props.onChange({ type, sort, terms });
  };

  const handleTagClick = (term: Term) => {
    setTerms([term.slug]);
  };

  useEffect(() => {
    emitter.on("TAG_CLICK", handleTagClick);
    return () => emitter.off("TAG_CLICK", handleTagClick);
  }, []);
  useEffect(() => {
    if (!isMobile) {
      props.onChange({ type: types, sort, terms });
    }
  }, [types, sort, terms]);

  useEffect(() => {
    const replace = filterCount > 0 ? `(${filterCount.toString()})` : "";
    const more = labels.filter_cta.more.replace("{{COUNT}}", replace);
    setButtonLabel(more);
  }, [filterCount]);

  useEffect(() => {
    onDrawerChange(drawerOpen);
  }, [drawerOpen]);

  useEffect(() => {
    if (open !== drawerOpen) setDrawerOpen(open);
  }, [open]);

  return (
    <div className="listing-page-form">
      <div className="listing-page-form__row" ref={rowRef}>
        <FiltersDrawer
          open={drawerOpen}
          searchId={searchId}
          onReset={handleReset}
          onClose={handleClose}
          onApply={handleMobileApply}
          resetActive={resetActive}
          filterCount={filterCount}
          sort={sort}
          types={types}
          formData={formData}
          labels={labels}
          onTypeChange={handleTypeChange}
          onSortChange={handleSortChange}
          onChange={handleTermChange}
        />
        <div className="listing-page-form__show-more">
          <button className="filter-button" onClick={() => setDrawerOpen(true)}>
            <p dangerouslySetInnerHTML={{ __html: buttonLabel }}/>
            <span className="icon">
              <Caret />
            </span>
          </button>
        </div>
        <div className="listing-page-form__filters">
          <div className="listing-page-form__type">
            <p className="eyebrow" dangerouslySetInnerHTML={{ __html: labels.content_type_label }}/>
            <div className="flex content-types">
              <label
                className={cn(
                  "content-types__input",
                  types.includes("post") && "active"
                )}
              >
                <input
                  type="checkbox"
                  name="type"
                  onChange={() => handleTypeChange("post")}
                />
                <p className="body-small" dangerouslySetInnerHTML={{ __html: options.blog_post_label }} />
                <span className="circle" />
              </label>
              {props.formData.types.map((type) => (
                <label
                  key={type.name}
                  className={cn(
                    "content-types__input",
                    types.includes(type.name) && "active"
                  )}
                >
                  <input
                    type="checkbox"
                    name="type"
                    onChange={() => handleTypeChange(type.name)}
                  />
                  <p
                    className="body-small"
                    dangerouslySetInnerHTML={{ __html: type.label }}
                  />
                  <span className="circle" />
                </label>
              ))}
            </div>
          </div>
          <div className="listing-page-form__sort">
            <p className="eyebrow" dangerouslySetInnerHTML={{ __html: labels.sort_by_label }}/>
            <Select
              options={selectOptions}
              onChange={handleSortChange}
              defaultValue={selectOptions[0]}
              value={selectOptions.find((option) => option.value === sort)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
