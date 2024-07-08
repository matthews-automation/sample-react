import Caret from "@/assets/icons/caret.svg";

import "./index.scss";

type Props = {
  page: number;
  maxPage: number;
  onPageChange: (page: number) => void;
};
export default function Pagination(props: Props) {
  const { page, maxPage, onPageChange } = props;
  let pages: number[] = [];
  if (maxPage > 2) {
    if (page === 1) pages = [1, 2, 3];
    else if (page === maxPage) pages = [maxPage - 2, maxPage - 1, maxPage];
    else pages = [page - 1, page, page + 1];
  } else {
    for (let i = 1; i <= maxPage; i++) pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="pagination__arrow prev"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <Caret />
      </button>

      {page > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="pagination__button tag tag--large"
          >
            1
          </button>
          <span className="tag tag--large">•••</span>
        </>
      )}
      {pages.map((p) => (
        <button
          className="pagination__button tag tag--large"
          key={p}
          onClick={() => onPageChange(p)}
          disabled={page === p}
        >
          {p}
        </button>
      ))}
      {page < maxPage - 1 && <span className="tag tag--large">•••</span>}
      {maxPage > 3 && page < maxPage - 1 && (
        <button
        className="pagination__button tag tag--large"
          onClick={() => onPageChange(maxPage)}
          disabled={page === maxPage}
        >
          {maxPage}
        </button>
      )}

      <button
        className="pagination__arrow next"
        onClick={() => onPageChange(page + 1)}
        disabled={page === maxPage}
      >
        <Caret />
      </button>
    </div>
  );
}
