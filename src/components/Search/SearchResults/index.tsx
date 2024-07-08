"use client";
import Link from "next/link";
import { parseLink } from "@/core/utils";

import "./index.scss";

type Props = {
  items: SearchResultItem[];
  count: number;
  label: string;
  no_results_label: string;
};

export default function SearchResults({ items, label, count, no_results_label }: Props) {
  let displayLabel;
  if (!count) displayLabel = no_results_label;
  else displayLabel = label.replace('{{COUNT}}', count.toString());
  
  return (
    <div className="search-results">
      <div className="search-results__count">
        <p className="eyebrow" dangerouslySetInnerHTML={{ __html: displayLabel }} />
      </div>
      {items.map((item) => (
        <div key={item.id} className="search-results__item">
          <h3 className="subtitle-3" dangerouslySetInnerHTML={{__html: item.title}}/>
          <p className="body" dangerouslySetInnerHTML={{ __html: item.page_meta?.description }}/>
          <Link href={parseLink(item.link)} dangerouslySetInnerHTML={{ __html: item.link }} />
        </div>
        )
      )}
    </div>
  );
};