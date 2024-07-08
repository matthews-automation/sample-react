interface ButtonProps {
  label: string;
  url?: string;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  arrowDirection?: string;
  variant?: string;
  lightLabel?: boolean;
}
interface BlockProps {
  image?: ImageData;
  youtube_video_id?: string;
  title?: string;
  content?: string;
  sliderContent?: string;
  label?: string;
  secondaryCta?: ACFLink;
  inlineCta: ACFLink;
  logoImageUrl?: string;
  quote?: string;
  attribution?: string;
  date: string;
  tags: string[];
  logooutline: ImageData;
}

interface FormField {
  name: string;
  type: string;
  label: string;
  depends_on?: string;
  placeholder?: string;
  width: string;
  required: boolean;
}

interface SlidesProps {
  blocks: BlockProps[];
  peek?: boolean;
  slidesPerPage: number | string;
  slidesPerPageL: number | string;
  alternateImgs: boolean;
  insights?: boolean;
}

interface ACFLink {
  title: string;
  url: string;
  target: string;
}

interface IconButtonProps extends ButtonProps {
  noLink?: boolean;
  label?: string;
  flip?: boolean;
  icon: string | FC<SVGProps<SVGElement>>;
}

interface MenuItem {
  title: string;
  url: string;
  target: string;
  ID: number;
  post_name: string
  object_id: string;
  children: MenuItem[];
  button: ACFLink;
}

declare module "@splidejs/react-splide" {
  export { Options } from "@splidejs/splide";
  export { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
}

declare module 'react-hyphen';

interface SiteOptions {
  header: {
    header_button: ACFLink;
    header_social_label: string;
    search_link: string;
  };
  footer: {
    footer_legal: string;
    footer_copyright: string;
    footer_social_label: string;
  };
  region_assist: {
    headline: string;
    body: string;
    buttons: { yes: string; no: string }
  };
  continue_cta: string;
  blog_post_label: string;
  search_keywords_label: string;
  language_select_label: string;
  social_urls: {
    linkedin_url: string;
    facebook_url: string;
    instagram_url: string;
  };
}
interface HeaderProps {
  items: MenuItem[];
  options: SiteOptions['header'];
  social_urls: SiteOptions['social_urls'];
  pageID: number;
  showLangSelector: boolean;
}

interface TestimonialsProps {
  background_color: 'black' | 'white';
  quotes: { quote: string; attribution: string; }[];
  peek?: boolean;
  imageHeight: number;
  alternateImgs: boolean;
  autoplay: boolean;
}

interface ImageData {
  url: string;
  alt?: string;
}

interface OverviewTextProps {
  headline: string;
  description: string;
  cta: ACFLink;
}

interface TwoUpProps {
  image: ImageData;
  eyebrow: string;
  headline: string;
  description: string;
  primary_cta: ACFLink;
  secondary_cta: ACFLink;
  layout: string;
  gradient: boolean;
}

interface LinkListingProps {
  headline: string;
  sub_header: string;
  cta: ACFLink;
  links: ListingLink[];
}

interface ListingLink {
  link: ACFLink;
  info: string;
  title: string;
  image: ImageData;
}

interface ToggleProps {
  metric: boolean;
  onClick: () => void;
}

interface Item {
  name: string;
  link: string;
}

interface ImageParallaxProps {
  imageUrl: string;
  classes: string[];
}

interface AccordionItemProps {
  key?: number;
  index?: number;
  menuTitle?: string;
  title?: string;
  itemsList?: Item[];
  content?: string;
  button?: string;
  url?: string;
  clicked?: boolean;
  single?: boolean;
  onClick?: (index: number) => void;
  children?: React.ReactNode;
}

interface AccordionItem {
  title: string;
  content: string;
  cta: ACFLink;
}
interface AccordionProps {
  layout: 'left' | 'right'
  media_type: MediaTypes;
  media_video: string;
  media_image: ImageData;
  media_youtube_video: string;
  headline: string;
  cta?: ACFLink;
  description: string;
  accordion_items: AccordionItem[];
}

interface Threeup {
  test: string;
}

interface SpecsItem {
  spec_title: string;
  specs_content: string;
  unit_of_measure: 'mm' | 'kg' | 'm/s' | 'in' | 'lb' | 'in/s' | 'none'
}

interface SpecsProps {
  image_ratio: '6/7' | '5/4';
  media_image: ImageData;
  media_youtube_video: string;
  eyebrow: string;
  headline: string;
  description: string;
  primary_cta: ACFLink;
  secondary_cta: ACFLink;
  specs_list_title: string;
  specs_list: SpecsItem[];
}

enum MediaTypes {
  image = 'image',
  video = 'video',
  youtube = 'youtube'
}

interface SlideShowProps {
  slides: {
    media_type: MediaTypes;
    slide_content: string;
    cta: ACFLink;
    image: ImageData;
    youtube_video_id: string;
    media_video: string;
  }[];
}

interface SliderProps {
  children: React.ReactNode[];
  slidesPerPage?: number;
  slidesPerPageM?: number;
  slidesPerPageL?: number;
  paddingRight?: string;
  paddingRightM?: string;
  paddingRightL?: string;
  peek?: boolean;
  className?: string;
  trackClassName?: string;
  isControlled?: boolean;
  currentIndex?: number;
  parentSelector?: string;
  onIndexChange?: (index: number) => void;
  insights?: boolean;
  autoplay?: boolean;
}

interface MediaProps {
  headline: string;
  description: string;
  cta: ACFLink;
  media_cards: {
    media_type: MediaTypes;
    media_image: ImageData;
    media_youtube_video: string;
    media_video: string;
    card_content: string;
  }[];
  peek?: boolean;
  alternate_sizes: boolean;
}

interface ContentBlockProps {
  headline: string;
  description: string;
  cta: ACFLink;
  blocks: {
    media_type: MediaTypes;
    media_video: string;
    image: ImageData;
    youtube_video_id: string;
    title: string;
    card_content: string;
    primary_cta?: ACFLink;
    secondary_cta?: ACFLink;
  }[];
}

interface BlogHeroProps {
  blog_post_title: string;
  blog_post_image: string;
}

interface BlogSectionProps {
  section_title: string;
  section_content: string;
  expandable_content: boolean;
  isPageComponent?: boolean;
}

interface FooterProps {
  locale: string;
  options: SiteOptions['footer'];
  social_urls: SiteOptions['social_urls'];
  variant?: WebGLHeroVariants;
}

interface PageMeta {
  title: string;
  description: string;
  og_image?: string;
  is_division: boolean;
}

interface ListingFormData {
  [key: string]: string | string[];
}

interface FormAPIResponse {
  types: Array<{ name: string; label: string; }>;
  terms: Term[];
}

interface Term {
  term_id: number;
  name: string;
  slug: string;
  term_ids?: number[];
  description: string;
  parent: number;
  count: number;
  children?: Term[];
  displayChildren?: Term[];
}

interface Insight {
  id: number;
  title: string;
  date: string;
  terms: Term[];
  link: string;
  type: string;
  type_label: string;
  featured_image: string;
}

interface InsightsAPIResponse {
  insights: Insight[];
  total: number;
  max_num_pages: number;
}

enum WebGLHeroVariants {
  ONE = 'one',
  TWO = 'two',
  THREE  ='three',
  FOUR = 'four'
}

interface WebGLHero {
  variant: WebGLHeroVariants;
  headline: string;
  description: string;
  video: {
    video_thumbnail: string;
    video: string;
    video_clip: string;
    video_label: string;
    captions?: string;
    title: string;
    description: string;
  }
  scroll_down_cta: ACFLink;
}

interface HeroDetailProps {
  eyebrow: string;
  headline: string;
  sub_header: string;
  background: ImageData;
  variant: string;
  option_png_image: boolean;
  png_image: ImageData;
}

interface FeatureCardItem {
  xl_text: string;
  icon: ImageData;
  headline: string;
  description: string;
}

interface Language {
  code: string;
  name: string;
  native_name: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  label: string;
}

interface ListingFeatureProps {
  variant: 'dark' | 'light';
  background_image: ImageData;
  headline: string;
  description: string;
  card_image: ImageData;
  date: string;
  eyebrow: string;
  card_headline: string;
  card_content: string;
  tags: { tag: string }[];
  cta: ACFLink;
}

interface FeatureCardProps {
  headline: string;
  description: string;
  cta: ACFLink;
  layout: 'default' | 'icon' | 'font';
  cards: FeatureCardItem[];
}

interface OverviewImagesProps {
  images: { [key: string]: ImageData };
  headline: string;
  description: string;
  cta: ACFLink;
};
