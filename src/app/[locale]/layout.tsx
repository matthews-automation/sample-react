import { Exo_2, Raleway } from "next/font/google";
import { headers } from "next/headers";
import Header from "@/components/Header";
import api from "@/core/api";
import Footer from "@/components/Footer";
import ScrollContextProvider from "@/providers/scroll-pos";
import ScrollRestorer from "@/hooks/scroll-restore";
import RegionAssist from "@/components/RegionAssist";
import LanguageSelector from "@/components/LanguageSelector";
import ActivePageProvider from "@/providers/active-page";
import OptionsProvider from "@/providers/options";
import { getLocale } from "@/core/utils";
import ViewSizeContextProvider from "@/providers/view-size";
const exo = Exo_2({ subsets: ["latin"], variable: "--headline-font" });
const raleway = Raleway({ subsets: ["latin"], variable: "--body-font" });

import "@/styles/scaffold.scss";


export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const bodyClasses = [exo.variable, raleway.variable].join(" ");
  const locale = getLocale(params.locale);
  const headerItems = await api.getMenu(locale, "primary");
  const reqHeaders = headers();
  let path = reqHeaders.get("x-pathname") || "/";
  if (path === "/") path = "home";
  const page = await api.getPage<Page>(locale, path);
  const options = await api.getOptions(locale);
  const languages = await api.getLanguages();
  const showLangSelector = languages && languages.length > 1;
  let footerVariant: WebGLHeroVariants | undefined;
  if (page) footerVariant = ('hero' in page.acf) ? page.acf.hero?.variant : page.acf.webgl_hero?.variant;

  return (
    <html lang={params.locale}>
      <body className={bodyClasses}>
        <ActivePageProvider pageID={page?.ID}>
          <ScrollRestorer />
          <ScrollContextProvider>
            <ViewSizeContextProvider>
              <Header
                items={headerItems}
                options={options.header}
                pageID={page?.ID}
                showLangSelector={showLangSelector}
                social_urls={options.social_urls}
              />
            </ViewSizeContextProvider>
          </ScrollContextProvider>
          <OptionsProvider initialOpts={options}>
            {children}
          </OptionsProvider>
          {/* { options.region_assist && <RegionAssist content={options.region_assist}/> } */}
          { showLangSelector  && <LanguageSelector languages={languages} label={options.language_select_label} /> }
          <Footer
            locale={locale}
            options={options.footer}
            variant={footerVariant}
            social_urls={options.social_urls}
          />
        </ActivePageProvider>
      </body>
    </html>
  );
}
