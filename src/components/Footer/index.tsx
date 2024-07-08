import cn from "classnames";
import Logo from "@/assets/icons/logo.svg";
import api from "@/core/api";
import Facebook from "@/assets/icons/facebook.svg";
import Instagram from "@/assets/icons/instagram.svg";
import Linkedin from "@/assets/icons/linkedin.svg";
import "./index.scss";
import { parseLink } from "@/core/utils";

export default async function Footer(props: FooterProps) {
  const { locale, options, social_urls, variant } = props;
  const { instagram_url, linkedin_url, facebook_url } = social_urls;

  const footerItems = await api.getMenu(locale, "footer");
  const copyright = options?.footer_copyright.replace(
    "{{YEAR}}",
    `${new Date().getFullYear()}`
  );
  if (!footerItems.length || !options) {
    return (
      <footer className={cn("footer", variant && `footer--${variant}`)}>
        <div className="container">
          <div className="row justify-center">
            <h2 className="display-5 text-center">
              Missing Footer Items or Options.<br />
              Ensure they are set in the CMS for locale: {locale}
            </h2>
          </div>
        </div>
      </footer>
    );
  }
  return (
    <footer className={cn("footer", variant && `footer--${variant}`)}>
      <div className="container">
        <div className="row">
          <div className="footer__top justify-between align-center">
            <div className="col-12 col-md-4">
              <Logo className="footer-logo" />
            </div>
            <div className="col-12 col-md-6">
              <ul className="footer__menu flex-column flex-md-row d-flex align-md-center justify-end">
                {footerItems.map((item) => (
                  <li key={item.ID}>
                    <a href={parseLink(item.url)} target={item.target} className="body" dangerouslySetInnerHTML={{ __html: item.title }}/>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6 footer__mid">
            <p className="tag" dangerouslySetInnerHTML={{ __html: options.footer_social_label }}/>
            <ul className="footer-social d-flex align-center">
              <li>
                <a href={linkedin_url} target="_blank">
                  <Linkedin />
                </a>
              </li>
              <li>
                <a href={facebook_url} target="_blank">
                  <Facebook />
                </a>
              </li>
              <li>
                <a href={instagram_url} target="_blank">
                  <Instagram />
                </a>
              </li>
            </ul>
          </div>
          <div className="col-12 col-lg-6 footer__bottom text-lg-right justify-end d-md-flex flex-lg-column">
            <div className="col-12 col-md-6 col-lg-12">
              <p className="body-small" dangerouslySetInnerHTML={{ __html: options.footer_legal }}/>
            </div>
            <div className="col-12 col-md-6 col-lg-12">
              <p className="body-small text-md-right" dangerouslySetInnerHTML={{ __html: copyright }}/>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
