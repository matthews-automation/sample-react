import { Metadata } from "next";
import { notFound } from "next/navigation";
import cn from "classnames";
import api from "@/core/api";
import OgImage from "@/assets/images/og-image.jpg";
import WebGLHero from "@/components/WebGLHero";
import HeroDetail from "@/components/HeroDetail";
import Insights from "@/components/Insights";
import SetActivePage from "@/hooks/set-active-page";
import ScrollContextProvider from "@/providers/scroll-pos";
import ComponentMapper from "@/components/ComponentMap";
import ListingPage from "@/components/ListingPage";
import ViewSizeContextProvider from "@/providers/view-size";
import Contact from "@/components/Contact";
import { getLocale } from "@/core/utils";
import { isIOSDevice } from "@/hooks/is-ios";
import SubNavigation from "@/components/SubNavigation";
import Search from "@/components/Search";
import SetContactCookie from "@/hooks/set-contact-cookie";

type Props = {
  params: { locale: string; path: string[]; };
  searchParams: { [key: string]: string | string[] | undefined }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pagePath = params.path.join("/");
  const locale = getLocale(params.locale);
  if (!params.path.length || !locale) return {};
  const data = await api.getPage<Page>(locale, pagePath);
  if (!data) return { title: "404 Not Found" };
  const { acf } = data;
  if (!acf) return {};
  const { page_meta } = acf;
  const image = page_meta?.og_image || OgImage.src;
  return {
    title: page_meta?.title || data.post_title,
    description: page_meta?.description,
    openGraph: {
      description: page_meta?.description,
      title: page_meta?.title || data.post_title,
      images: [image],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const locale = getLocale(params.locale);
  const pagePath = params.path.join("/");
  const data = await api.getPage<Page>(locale, pagePath);
  if (!data) notFound();
  const { template } = data;
  const isLandingPage = template === "landing-page-template.php";
  const isContactPage = template === "contact-page-template.php";
  const isSearchPage = template === "search-page-template.php";
  const showHeroDetail = !isLandingPage && !isContactPage && !isSearchPage;
  const isListingPage = template === "listing-page-template.php";
  const showComponentMap = !isListingPage && !isContactPage && !isSearchPage;
  const lightMode = template === "home-page-template.php" || isLandingPage;
  const formData = await api.getInsightsFormData(locale);

  let initialData: InsightsAPIResponse | null = null;
  if (isListingPage) {
    const { term } = searchParams;
    const args: { [key: string]: any } = { };
    if (term) args['terms'] = [term as string];
    initialData = await api.getInsights(locale, args);
  }

  const { acf } = data;
  if (!acf) return "No acf data found";
  const isIOS = isIOSDevice();

  const { content, webgl_hero, hero_detail, include_sub_navigation } = acf;

  return (
    <div className={cn("page", { 'page--search': isSearchPage, 'page--listing': isListingPage, 'page--landing': isLandingPage })}>
      <SetActivePage pageID={data.ID} headerLight={lightMode} />
      <SetContactCookie page={data} />
      <ViewSizeContextProvider>
        {isLandingPage && webgl_hero && <WebGLHero data={webgl_hero} isIOS={isIOS} includeSubNav={include_sub_navigation}/>}
        <ScrollContextProvider>
          <div className={cn('page__content')}>
            {showHeroDetail && <HeroDetail HeroDetailProps={hero_detail} includeSubNav={include_sub_navigation} />}
            {include_sub_navigation && (
              <SubNavigation
                guidingText={acf.sub_navigation_guide_text}
                subNavTitle={acf.sub_navigation_title!}
                isDetail={showHeroDetail}
                links={acf.sub_nav_links!}
              />
            )}
            { isSearchPage && <Search {...data.acf as unknown as SearchPage} locale={locale} /> }
            {isListingPage && initialData && (
              <ListingPage
                content={data}
                initialData={initialData}
                formData={formData}
              />
            )}
            {showComponentMap && (
              <ComponentMapper
                data={data}
                content={content}
                pagePath={pagePath}
              />
            )}
            {isContactPage && (
              <Contact {...(data as unknown as ContactPage)} locale={locale} />
            )}
          </div>
          {!isListingPage && data.acf.insights_carousel && (<Insights data={data.acf.insights_carousel} locale={locale} />)}
        </ScrollContextProvider>
      </ViewSizeContextProvider>
    </div>
  );
}
