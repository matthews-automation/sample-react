import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { parseHeadlineHighlight } from "@/core/utils";
import ImageParallax from "../ImageParallax";
import cn from "classnames";

import "./index.scss";

export default function OverviewImages(props : OverviewImagesProps) {
const { images, headline, description, cta } = props;
const imageUrls = Object.values(images).map(image => image.url);
const parsedHeadline = parseHeadlineHighlight(headline);

return (
    <div className="overview-images">
      <div className="container">
        <div className="row">
          {imageUrls[3] && (
            <div className="relative col-md-2 col-0">
              <div className="col-9">
                <ImageParallax imageUrl={imageUrls[3]} classes={["one"]} />
              </div>
            </div>
          )}
          <div className="col-md-6 col-12 row row__no-padding relative ">
            {imageUrls[0] && (
              <ImageParallax
                imageUrl={imageUrls[0]}
                classes={["two", "scroller-outro-target"]}
              />
            )}
            <div className="flex-column justify-between text-block col-12">
              {headline && (
                <h3
                  className="display-3 col-md-8 col-12 uppercase"
                  dangerouslySetInnerHTML={{ __html: parsedHeadline }}
                />
              )}
              <div className="col-md-6 col-9 col-md-offset-6 col-offset-3">
                {description && <p className={cn("body opacity-70", {"no-cta": !cta})} dangerouslySetInnerHTML={{ __html: description }}/>}
              </div>
              <div className="d-flex">
                {cta && (
                  <div className="col-md-6 col-9 col-md-offset-6 col-offset-3">
                    <PrimaryButton url={cta.url} label={cta.title} />
                  </div>
                )}
              </div>
            </div>
            {imageUrls[2] && (
              <ImageParallax imageUrl={imageUrls[2]} classes={["four"]} />
            )}
          </div>
          {imageUrls[1] && (
            <div className="relative col-md-2 col-0">
              <ImageParallax imageUrl={imageUrls[1]} classes={["three"]} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}