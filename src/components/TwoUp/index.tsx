import cn from "classnames";
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import InlineButton from "@/components/Buttons/InlineButton"
import ImageParallax from "../ImageParallax";

import "./index.scss";

export default function TwoUp(props: TwoUpProps) {
  const {image, eyebrow, headline, description, primary_cta, secondary_cta, layout, gradient} = props;
  const isCopyImage = layout === 'right';
  let gradientClass = '';
  if (gradient) gradientClass = isCopyImage ? "gradientGrayWhite" : "gradientWhiteGray";

  return (
    <div className="two-up container comp-padding">
        <div className={cn('row align-items-stretch two-up-paragraph', { 'flex-row-reverse': isCopyImage })}>
          <div className={cn("col-12 col-md-6", { 'col-md-offset-1': isCopyImage })}>
            {image && <ImageParallax imageUrl={image.url} classes={["ratio-6-7"]} />}
          </div>

          <div className={cn('col-12 align-center d-flex col-md-5 inner-comp content-container', gradientClass, { 'col-md-offset-1': !isCopyImage  })}>
            <div className="title-lockup">
              {eyebrow && <p className="eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }} /> }
              {headline && <h3 className="subtitle-3" dangerouslySetInnerHTML={{ __html: headline }} /> }
              {description && <p className="body opacity-70" dangerouslySetInnerHTML={{ __html: description }} />}
              <div className="buttons-wrap-larger">
                {primary_cta && <SecondaryButton url={primary_cta.url} label={primary_cta.title} />}
                {secondary_cta && <InlineButton url={secondary_cta.url} label={secondary_cta.title} />}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}