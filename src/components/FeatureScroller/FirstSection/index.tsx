import { parseHeadlineHighlight } from "@/core/utils";
import LogoMask from "@/assets/icons/logo-mask.svg";
import LogoBackground from "@/assets/icons/logo-mask-bg.svg";
import { useViewSize } from "@/providers/view-size";

import "./index.scss";

export default function FeatureScrollerFirstSection(props: Homepage['acf']['feature_scroller']['first_section']) {
  const { headline, body } = props;
  const parsedHeadline = parseHeadlineHighlight(headline, 'split') as string[];
  const { isMobile } = useViewSize();
  
  return (
    <div className="first-section">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-3 title-col">
            <h2 className="display-3 first-section__title" dangerouslySetInnerHTML={{ __html: parsedHeadline.join('') }} />
          </div>
          <div className="col-9 col-offset-3 col-md-3 col-md-offset-0 first-section__body-wrapper">
            <div className="body" dangerouslySetInnerHTML={{ __html: body }} />
            { !isMobile ?
              <LogoMask className="logo scroller-target" />
              : <LogoBackground className="logo logo--mobile" />
            }
          </div>
        </div>
      </div>
    </div>
  )
}