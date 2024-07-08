"use client";
import Slide from "../Slides/Slide";

import "./index.scss";

export default function FeatureScrollerSlidesMobile(props: {
  slides: Homepage["acf"]["feature_scroller"]["slides"];
}) {
  return (
    <div className="feature-scroller-mobile">
      <div className="feature-scroller-mobile__slides">
        {props.slides.map((slide, index) => (
          <Slide key={index} slide={slide} index={index} sectionHeight={100} offset={0} isMobile />
        ))}
      </div>
    </div>
  )
}
