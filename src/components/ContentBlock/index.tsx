import cn from 'classnames';
import Slider from '../Slider';
import ImageParallax from "../ImageParallax";
import InlineButton from "@/components/Buttons/InlineButton"
import SecondaryButton from "../Buttons/SecondaryButton";
import YoutubeEmbed from "../Youtube";
import InlineVideo from '../InlineVideo';

import "./index.scss";

export default function ContentBlock(props: ContentBlockProps) {
  const { headline, description, cta, blocks } = props
  const showHeader = headline || description || cta;
  const isSlider = blocks.length > 4;
  const headerClasses = blocks.length < 3 ? 'col-md-4' : 'col-md-12';
  const cardContainerClasses = blocks.length < 3 && showHeader ? 'col-md-8' : '';
  const TagName = !isSlider ? 'div' : Slider;
  const tagClass = !isSlider ? 'card-container' : '';

  return (
    <div className="content-block">
      <div className='container comp-padding-larger'>
        <div className="row">
          { showHeader && 
              <div className={cn("heading-lockup col-12", headerClasses)}>
                <div className="copy-col">
                  {headline && <h4 className="display-4 uppercase" dangerouslySetInnerHTML={{ __html: headline }} />}
                  {description && <p className="body sub-header opacity-70" dangerouslySetInnerHTML={{ __html: description }} />}
                </div>
                { cta && <InlineButton label={cta.title} url={cta.url} /> }
            </div>
          }
          <div className={cn("col-12", cardContainerClasses)}>
            <TagName className={tagClass}>
                {blocks && blocks.map((block, i) => (
                  <div key={i} className={cn("content-block__card", `card--${blocks.length}`)}>
                    {block.media_type === "image" &&  <ImageParallax imageUrl={block.image.url} classes={["ratio-6-7"]} />}
                    {block.media_type === "youtube" && <YoutubeEmbed youtubeurl={block.youtube_video_id} />  }
                    {block.media_type === "video" && <InlineVideo video={block.media_video} />}

                    <h5 className="subtitle-5" dangerouslySetInnerHTML={{ __html: block.title }} />
                    <p className="body-small opacity-70" dangerouslySetInnerHTML={{ __html: block.card_content }} />
                    {block.secondary_cta || block.primary_cta ?
                      <div className="buttons-wrap-top">
                        {block.primary_cta && <SecondaryButton url={block.primary_cta.url} label={block.primary_cta.title}/>}
                        {block.secondary_cta && <InlineButton url={block.secondary_cta.url} label={block.secondary_cta.title}/>}
                      </div>
                      :
                      <></>
                    }
                  </div>
                ))}
              </TagName>
          </div>
        </div>
      </div>
    </div>
  )
}