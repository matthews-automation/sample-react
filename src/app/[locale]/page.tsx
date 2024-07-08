import type { Metadata } from 'next'
import { notFound } from "next/navigation";
import FeatureScroller from "@/components/FeatureScroller";
import WebGLHero from "@/components/WebGLHero";
import Insights from "@/components/Insights";
import { getLocale } from "@/core/utils";
import api from "@/core/api";
import OgImage from '@/assets/images/og-image.jpg';
import ViewSizeContextProvider from '@/providers/view-size';
import ScrollContextProvider from '@/providers/scroll-pos';
import SetActivePage from '@/hooks/set-active-page';
import { isIOSDevice } from '@/hooks/is-ios';
import SetContactCookie from '@/hooks/set-contact-cookie';
 
type Props = {
  params: { locale: string }
}
 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = getLocale(params.locale);
  const data = await api.getPage<Homepage>(locale, "home").then((res) => res);
  if (!data) return { title: "404 Not Found" };
  const { page_meta } = data.acf;
  const image = page_meta.og_image || OgImage.src;
  return {
    title: page_meta.title,
    description: page_meta.description,
    openGraph: {
      description: page_meta.description,
      title: page_meta.title,
      images: [image],
    },
  }
}

export default async function Page({ params }: Props) {
  const locale = getLocale(params.locale);
  const data = await api.getPage<Homepage>(locale, "home").then((res) => res);
  if (!data) notFound();
  const isIOS = isIOSDevice();
  const lightMode = data.template === 'home-page-template.php' || data.template === 'landing-page-template.php';
  return (
    <div className="page page--home">
      <SetActivePage pageID={data.ID} headerLight={lightMode}/>
      <SetContactCookie deleteCookie />
      <ViewSizeContextProvider>
        <ScrollContextProvider>
          <WebGLHero data={data.acf.hero} isIOS={isIOS} includeSubNav={false} />
          <FeatureScroller {...data.acf.feature_scroller} />
          { data.acf.insights_carousel && <Insights data={data.acf.insights_carousel} locale={locale} /> }
        </ScrollContextProvider>
      </ViewSizeContextProvider>
    </div>
  );
}
