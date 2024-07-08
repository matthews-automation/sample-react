import InlineButton from "../Buttons/InlineButton";
import ImageParallax from "../ImageParallax";
import "./index.scss";

export default function ListingFeature(props: ListingFeatureProps) {
  const {
    variant,
    headline,
    description,
    background_image,
    card_image,
    date,
    eyebrow,
    card_headline,
    card_content,
    tags,
    cta,
  } = props;
  const isLightLabel = variant === "light";

  return (
    <div className={`listing-feature relative ${variant}`}>
      <ImageParallax imageUrl={background_image.url} classes={["absolute"]} />
      <div className="container">
        <div className="row content relative align-center">
          <div className="col-md-3 col-12 side-lockup">
            <h3 className="display-4 uppercase" dangerouslySetInnerHTML={{ __html: headline }}/>
            <p className="body sub-header" dangerouslySetInnerHTML={{ __html: description  }}/>
          </div>
          <div className="col-md-8 col-md-offset-1 col-12 d-md-flex">
            <ImageParallax
              imageUrl={card_image.url}
              classes={["ratio-6-7", "listing-card-image"]}
            />
            <div className="d-flex align-center justify-center card-background">
              <h5 className="eyebrow">
                {date} / <span dangerouslySetInnerHTML={{ __html: eyebrow }} />
              </h5>
              <h5 className="subtitle-5" dangerouslySetInnerHTML={{ __html: card_headline }} />
              <p className="body-small opacity-70" dangerouslySetInnerHTML={{ __html: card_content }}/>
              <div className="buttons-wrap-top">
                <div className="d-flex flex-wrap tag-box">
                  {tags &&
                    tags.map((tag, i) => (
                      <h5 key={i} className="tag tag--small" dangerouslySetInnerHTML={{ __html: tag.tag }} />
                    ))}
                </div>
                {cta && (
                  <InlineButton
                    url={cta.url}
                    label={cta.title}
                    lightLabel={isLightLabel}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
