import Link from "next/link";
import Arrow from "@/assets/icons/right-arrow.svg";

import "./index.scss";
import ImageParallax from "@/components/ImageParallax";
import { parseLink } from "@/core/utils";

export default function LinkListingLink({ title, info, link, image }: ListingLink) {
  return (
      <Link className="d-flex flex-wrap align-center link-listing-link" href={parseLink(link.url)}>

        <div className="col-md-3 col-0">
          <div className="col-9 zoomed_img">
            <ImageParallax imageUrl={image.url} classes={['ratio-16-9']} />
          </div>
        </div>
        <div className="col-md-8 col-11 zoomed_content">
          <div className="d-md-flex align-center">
            <div className="col-md-6 col-12">
              <h6 className="col-md-9 col-12 subtitle-4 title" dangerouslySetInnerHTML={{ __html: title }}/>
            </div>
            <div className="col-md-6 col-12">
              <p className="col-md-9 col-11 link body-small opacity-70" dangerouslySetInnerHTML={{ __html: info }}/>
            </div>
          </div>
        </div>
        <div className="col-1 d-flex align-center justify-center">
          <div className="link-button relative d-flex align-center justify-center">
            <Arrow />
          </div>
        </div>
      </Link>
  )
}
