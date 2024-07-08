import cn from "classnames";
import Slider from "../Slider";
import InlineButton from "../Buttons/InlineButton";
import ImageParallax from "../ImageParallax";
import YoutubeEmbed from "../Youtube";
import InlineVideo from "../InlineVideo";

import "./index.scss";

export default function Media(props: MediaProps) {
  const { headline, description, cta, media_cards, alternate_sizes } = props;
  const isSlider = media_cards.length > 3;
  const TagName = isSlider ? Slider : "div";
  const tagProps = isSlider ?  { slidesPerPageL: 3, slidesPerPageM: 2, paddingRightL: "2.5%" } : {}
  let wrapperClass = "col-12";
  if (media_cards.length > 1) wrapperClass = 'card-container col-12';
  if (media_cards.length > 3) wrapperClass = '';
  return (
    <div className=" media">
      <div className="container comp-padding-larger-bottom">
        <div className="row heading-lockup">
          <div className=" col-12 col-md-6">
            {headline && (
              <h4
                className="display-4 uppercase"
                dangerouslySetInnerHTML={{ __html: headline }}
              />
            )}
            {description && (
              <p
                className="body sub-header opacity-70"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
          <div className="col-12 col-md-6 button-col">
            {cta && <InlineButton url={cta.url} label={cta.title} />}
          </div>
        </div>
        <div className="row content-block">
          <TagName className={wrapperClass} {...tagProps}>
            {media_cards && media_cards.map(({ media_image, media_type, media_youtube_video, media_video, card_content }, i) => (
              <div key={i} className={cn("card", `card--${media_cards.length}`)}>
                {media_type === 'image' && (
                  <ImageParallax imageUrl={media_image.url}
                    classes={[
                      media_cards.length === 1
                        ? "ratio-16-9"
                        : alternate_sizes &&
                          media_cards.length > 1 &&
                          i % 2 === 0
                        ? "ratio-5-4"
                        : "ratio-6-7",
                    ]}
                  />
                )}
                {media_type === 'youtube' && <YoutubeEmbed youtubeurl={media_youtube_video} />}
                {media_type === 'video' && <InlineVideo video={media_video} /> }
                {card_content && <p className="body sub-header opacity-70" dangerouslySetInnerHTML={{ __html: card_content}} />}
              </div>
            ))}
          </TagName>
        </div>
      </div>
    </div>
  );
}
