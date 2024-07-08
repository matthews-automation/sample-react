"Use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { combineTerms, getCardTerms, parseLink } from "@/core/utils";

import "./index.scss";

type Props = {
  terms: Term[];
  onTagClick?: (term: Term) => void;
  combinedTerms: Term[];
};

export default function CardTerms(props: Props) {
  const { terms, combinedTerms } = props;
  const { locale }  = useParams();

  const displayTerms = getCardTerms(terms).map((term) => {
    let displayTerm = term;
    combinedTerms.forEach((combinedTerm) => {
      if (combinedTerm.displayChildren) {
        combinedTerm.displayChildren.forEach((child) => {
          if (child.term_ids?.includes(term.term_id)) displayTerm = child;
        });
      }
    });
    return displayTerm;
  });

  const getTermLink = (term: Term) => {
    if (locale === 'en') return `/insights/?term=${term.slug}`;
    return `/${locale}/insights/?term=${term.slug}`;
  };

  const handleTagClick = (e: React.MouseEvent, term: Term) => {
    if (props.onTagClick) {
      e.preventDefault();
      props.onTagClick(term);
    }
  };

  return (
    <div className="card-terms">
      {displayTerms.map((term) => (
        <Link
          href={parseLink(getTermLink(term))}
          key={term.term_id}
          className="card-terms__term tag"
          onClick={(e) => handleTagClick(e, term)}
        >
          <span dangerouslySetInnerHTML={{ __html: term.name }} />
        </Link>
      ))}
    </div>
  )
}