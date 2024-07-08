import Slider from "../Slider";
import cn from "classnames";
import InlineButton from "../Buttons/InlineButton";
import InsightCard from "../InsightCard";
import api from "@/core/api";

import "./index.scss";

type Props = {
  data: Page['acf']['insights_carousel'];
  locale: string;
}

export default async function Insights(props: Props) {
  const { locale } = props;
  const { heading, link, insight_carousel_type } = props.data!;
  const type = insight_carousel_type !== 'all' ? insight_carousel_type : '';
  
  const { insights } = await api.getInsights(locale, { per_page: 6, type });
  const formData = await api.getInsightsFormData(locale);
  return (
      <div className="insights">
      <div className="d-flex row insight-row">
        <div className="col-md-3 col-12 text">
          <h5 className={cn("display-5 uppercase", locale)} dangerouslySetInnerHTML={{ __html: heading }} />
          { link && <InlineButton label={link.title} url={link.url} /> }
        </div>
        <Slider
          slidesPerPage={1}
          slidesPerPageL={3}
          slidesPerPageM={2}
          parentSelector=".insight-row"
          peek={true}
        >
          {insights.map((insight, i) => <InsightCard key={i} insight={insight} formData={formData} /> )}
        </Slider>
      </div>
    </div>
  );
}
