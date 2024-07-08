import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { parseHeadlineHighlight } from "@/core/utils";

import "./index.scss";
export default function TextCta(props: OverviewTextProps) {
  const { headline, description, cta } = props;
  const parsedHeadline = parseHeadlineHighlight(headline);
  return (
    <div className="overview-text">
      <div className="container">
        <div className="row">
          <div className="col-6 col-md-3 col-md-offset-3">
            { headline && <h3 className="display-3 col-md-8 col-12 uppercase" dangerouslySetInnerHTML={{ __html: parsedHeadline }} /> }
          </div>
          <div className="text-cta col-9 col-offset-3 col-md-3 col-md-offset-0">
            {description && <p className="body opacity-70" dangerouslySetInnerHTML={{ __html: description }} />}
            {cta && <PrimaryButton url={cta.url} label={cta.title} />}
          </div>
        </div>
      </div>
    </div>
  );
}
