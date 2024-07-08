"use client";
import { useState } from "react";
import Slider from "../Slider";
import ImageParallax from "../ImageParallax";
import YoutubeEmbed from "../Youtube";
import SecondaryButton from "../Buttons/SecondaryButton";
import InlineVideo from "../InlineVideo";

import "./index.scss";

export default function Slideshow(props: SlideShowProps) {
  const { slides } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const onSlideChange = (index: number) => {
    setCurrentIndex(index);
  }

  return (
    <div className="slideshow">
      <div className="container comp-padding-larger-bottom">
        <div className="row">
          <Slider
            slidesPerPage={1}
            slidesPerPageM={1}
            slidesPerPageL={1}
            paddingRight="10%"
            paddingRightM="13%"
            paddingRightL="16.667%"
            isControlled={true}
            currentIndex={currentIndex}
            className="slideshow-image-slider"
          >
            {slides && slides.map(({ media_type, media_video, youtube_video_id, image }, i) => (
              <div key={i}>
                { media_type === "video" && <InlineVideo key={i} video={media_video} /> }
                { media_type === "image" && <ImageParallax imageUrl={image.url} classes={["ratio-16-9"]} /> }
                { media_type=== "youtube" && <YoutubeEmbed key={i} youtubeurl={youtube_video_id} /> }
              </div>
          ))}
          </Slider>
          <Slider
            slidesPerPage={1}
            slidesPerPageM={1}
            slidesPerPageL={1}
            peek={false}
            onIndexChange={onSlideChange}
            className="slideshow-content-slider"
          >
            {slides && slides.map((slide, i) => (
              <div key={`content-${i}`} className="slide-content">
                <p className="slide-content-text col-md-8 opacity-70" dangerouslySetInnerHTML={{ __html: slide.slide_content }} />
                { slide.cta && <SecondaryButton label={slide.cta.title} url={slide.cta.url} /> }
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
