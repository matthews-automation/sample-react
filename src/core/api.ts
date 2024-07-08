class API {
  baseUrl = process.env.NEXT_PUBLIC_FE_URL;

  private get = async <T>(path: string, locale: string): Promise<T> => {
    let url: string;
    if (locale === 'general') url = `${this.baseUrl}/api/${path}`;
    else url = `${this.baseUrl}/api/${locale}/${path}`;

    return await fetch(url)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(`Failed to fetch: ${url}`);
      }).then((data) => data).catch(e => {
        console.error(e);
        return null;
      });
  }

  getMenu = async (locale: string, name: string): Promise<MenuItem[]> => {
    return await this.get(`menu/${name}/`, locale);
  }

  getOptions = async (locale: string): Promise<SiteOptions> => {
    return await this.get('options/', locale);
  }

  getPage = async <T>(locale: string, name: string) => {
    return await this.get<T>(`page/${name}/`, locale);
  }

  getInsights = async (locale: string, params?: { [key: string]: string | number; }) => {
    let queryString = '';
    if (params) queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    const data = await this.get<{ insights: Insight[], total: number; max_num_pages: number; }>(`insights/?${queryString}`, locale);
    return data;
  }

  getInsight = async <T>(locale: string, slug: string, type: 'posts' | 'case-studies' | 'whitepapers') => {
    return await this.get<T>(`${type}/${slug}/`, locale);
  }

  getInsightsFormData = async (locale: string) => {
    return await this.get<FormAPIResponse>('insights/form/', locale);
  }

  getDivisions = async (locale: string) => {
    return await this.get<Division[]>('divisions/', locale);
  }

  getProducts = async (locale: string, id: string) => {
    return await this.get<Product[]>(`divisions/${id}`, locale);
  }
  getSearchResults = async (locale: string, params: { query: string; page: number }) => {
    const { query, page } = params;
    return await this.get<SearchApiResponse>(`search/?query=${query}&page=${page}`, locale);
  }

  getLanguages = async () => {
    return await this.get<Language[]>('languages/', 'general');
  }

  submitForm = async (name: string, data: { [key: string]: string }): Promise<{ success: boolean } | null> => {
    const url = `${this.baseUrl}/api/submit/${name}/`;
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()).then(data => data).catch(e => {
      console.error(e);
      return null;
    });
  }
}

export default new API();