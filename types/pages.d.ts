interface Page {
  ID: number;
  id: number;
  post_parent: number;
  post_title: string;
  title: { rendered: string; };
  template: string;
  parent_is_division?: boolean;
  acf: {
    webgl_hero?: WebGLHero;
    hero?: WebGLHero;
    hero_detail: HeroDetailProps;
    include_sub_navigation: boolean;
    sub_navigation_guide_text?: string;
    sub_navigation_title?: string;
    sub_nav_links?: Array<{ link: ACFLink }>;
    content?: any[];
    page_meta: PageMeta;
    insights_carousel?: {
      insight_carousel_type: string;
      heading: string;
      link: ACFLink;
    }
    filter_labels?: {
      filter_cta: {
        more: string;
        less: string;
      },
      content_type_label: string;
      sort_by_label: string;
      clear_all_label: string;
      apply_button_label: string;
      filter_modal_label: string;
      no_results_eyebrow: string;
      no_results_body: string;
      sort_by_option_labels: {
        recent: string;
        title_a_z: string;
        title_z_a: string;
      }
    },
  }
}

interface Homepage extends Page {
  acf: {
    hero: WebGLHero;
    feature_scroller: {
      first_section: {
        headline: string;
        body: string;
      }
      slides: Array<{
        label: string;
        headline: string;
        image: string;
        button: ACFLink;
      }>;
      end_section: OverviewImagesProps;
    };
    insights_carousel?: {
      insight_carousel_type: string;
      heading: string;
      link: ACFLink;
    };
    page_meta: PageMeta;
  }
};

interface ContactPage extends Page {
  locale: string;
  acf: {
    headline: string;
    form_tab_labels: {
      email_us: string;
      get_a_quote: string;
      request_support: string;
      find_us: string;
    },
    form_wysiwyg_tab: string;
    form_headline: string;
    form_mesages: {
      form_success_title: string;
      form_success_body: string;
      form_missing_fields: string;
      form_server_error: string;
    },
    form_labels: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
      address_2: string;
      city: string;
      state_province: string;
      zip_postal_code: string;
      country: string;
      division: string;
      select_a_division: string;
      product_specialization: string;
      select_product_specialization: string;
      maintenance_contract: string;
      yes: string;
      no: string;
      request_type: string;
      project: string;
      submit_request: string;
      send_email: string;
      your_message: string;
      your_message_placeholder: string;
    },
    request_types: Array<{ value: string; label: string }>;
    page_meta: {
      title: string;
      description: string;
      og_image: string;
    },
  }
}

interface BlogPage extends Page {
  acf: {
    featured_image: string;
    sections: BlogSectionProps[];
    page_meta: PageMeta;
  }
}

interface SearchPage extends Page {
  headline: string;
  body: string;
  search_placeholder: string;
  keywords_title: string;
  frequently_searched: { keyword: string }[];
  page_meta: PageMeta;
  locale: string;
  search_results_count_label: string;
  no_results: string;
}