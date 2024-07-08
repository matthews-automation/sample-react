interface Division {
  ID: number,
  post_title: string;
  post_name: string;
}

interface Product {
  ID: number,
  post_title: string;
  post_name: string;
}

interface SearchResultItem {
  id: number;
  title: string;
  link: string;
  page_meta: PageMeta;
}

interface SearchApiResponse {
  total: number;
  max_num_pages: number;
  results: SearchResultItem[];
  search_id: string;
}