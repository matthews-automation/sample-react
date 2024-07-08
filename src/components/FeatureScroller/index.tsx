"use client";
import FeatureScrollerFirstSection from "./FirstSection";
import FeatureScrollerSlides from "./Slides";
import OverviewImages from "../OverviewImages";
import { useViewSize } from "@/providers/view-size";


import "./index.scss";
import FeatureScrollerSlidesMobile from "./SlidesMobile";
export default function FeatureScroller(props: Homepage['acf']['feature_scroller']) {
  const { isMobile } = useViewSize();
  return (
    <div className="feature-scroller">
      <FeatureScrollerFirstSection { ...props.first_section } />
      {
        !isMobile ?
          <FeatureScrollerSlides slides={props.slides} />
          : <FeatureScrollerSlidesMobile slides={props.slides} />
        }
      <OverviewImages { ...props.end_section } />
    </div>
  )
}