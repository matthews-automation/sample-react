"use client"
import { useState } from "react";
import cn from "classnames";
import ImageParallax from "../ImageParallax";
import YoutubeEmbed from '../Youtube';
import AccordionItem from '../AccordionItem'
import SecondaryButton from "../Buttons/SecondaryButton";
import InlineButton from "../Buttons/InlineButton";
import InlineVideo from "../InlineVideo";

import "./index.scss";

export default function Accordion (props : AccordionProps) {
  const {
    layout,
    media_image,
    media_youtube_video,
    headline,
    description,
    accordion_items,
    cta,
    media_type,
    media_video,
  } = props;
  const [activeIndex, setActiveIndex] = useState<number | null>(null); 
  const imageLeft = layout === 'left';

  const handleItemClick = (index: number) => {
    if (activeIndex === index) setActiveIndex(null)
    else setActiveIndex(index)
  };

  return (
      <div className="accordion">
        <div className="container comp-padding-larger">
          <div className="row heading-lockup">
            <div className="col-12 col-md-6">
              <h4 className="display-4 uppercase col-12" dangerouslySetInnerHTML={{ __html: headline }}/>
              <p className="body sub-header opacity-70" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <div className="col-12 col-md-6">
              {cta && <InlineButton label={cta.title} url={cta.url} />}
            </div>
          </div>
          <div className={cn("inner-comp row", { 'flex-row-reverse': !imageLeft })}>
            <div className='col-12 col-md-6'>
              <div className="sticky">
                {media_type === 'image' && <ImageParallax imageUrl={media_image.url} classes={['ratio-5-4']} /> }
                {media_type === 'youtube' && <YoutubeEmbed youtubeurl={media_youtube_video} />}
                { media_type === 'video' && <InlineVideo video={media_video} /> }
              </div>
            </div>
            <div className={cn("col-12", !imageLeft ? "col-md-5 col-md-offset-right-1" : "col-md-5 col-md-offset-1")}>
              {accordion_items && accordion_items.map((item, index) => (
                <AccordionItem
                  key={index}
                  index={index}
                  title={item.title}
                  clicked={index === activeIndex}
                  onClick={() => handleItemClick(index)}
                  >
                    {item.content && <p className="body sub-header">{item.content}</p>}
                    <div className="buttons-wrap-top">
                      {item.cta && <SecondaryButton url={item.cta.url} label={item.cta.title} />}
                    </div>
                  </AccordionItem>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}