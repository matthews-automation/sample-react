"use client"
import { useState } from "react";
import cn from "classnames";
import ImageParallax from "../ImageParallax";
import YoutubeEmbed from '../Youtube';
import SecondaryButton from "../Buttons/SecondaryButton";
import InlineButton from "../Buttons/InlineButton";
import InlineVideo from "../InlineVideo";

import "./index.scss";

export default function Threeup (props : Threeup) {
  const {
    test
  } = props;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    if (activeIndex === index) setActiveIndex(null)
    else setActiveIndex(index)
  };

  return (
      <div className="threeup">
        <div className="container comp-padding-larger">
          <div className="row heading-lockup">
              <div className="col-12 col-md-12">
                <h1>This is a test section</h1>
                <h4>It was created as a test, to see how quickly we can add our own components.</h4>
                <p className="body sub-header opacity-70" dangerouslySetInnerHTML={{ __html: test }} />


              </div>
            </div>
        </div>
      </div>
  );
}
