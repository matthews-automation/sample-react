"use client";
import Link from "next/link";
import { combineTerms, parseLink } from "@/core/utils";
import { useOptions } from "@/providers/options";
import CardTerms from "../CardTerms";

import "./index.scss";

type Props = {
  insight: Insight;
  cardStyle?: React.CSSProperties;
  onTagClick?: (term: Term) => void;
  formData: FormAPIResponse;
};

export default function InsightCard(props: Props) {
  const { insight, cardStyle, onTagClick, formData } = props;
  const { options } = useOptions();
  const combinedTerms = combineTerms(formData.terms);
  return (
    <div
      className="insight-card"
      key={insight.id}
      style={cardStyle}
    >
      <Link className="insight-card__content" href={parseLink(insight.link)}>
        <div className="insight-card__content__image">
          <img src={insight.featured_image} alt={insight.title} />
        </div>
        <div className="insight-card__content__copy">
          <p className="eyebrow">
            {insight.date} /{" "}
            <span dangerouslySetInnerHTML={{__html: insight.type === "post" ? options.blog_post_label : insight.type_label }} />
          </p>
          <p className="subtitle-5" dangerouslySetInnerHTML={{ __html: insight.title }} />
        </div>
      </Link>
      {insight.terms && <CardTerms terms={insight.terms} onTagClick={onTagClick} combinedTerms={combinedTerms} />}
    </div>
  )
}