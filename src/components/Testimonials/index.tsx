import Image from "next/image";
import cn from "classnames";
import Slider from "../Slider"
import LogoOutline from '@/assets/icons/logo-outline.svg';

import "./index.scss";

export default function Testimonials(props: TestimonialsProps) {
  const { background_color, quotes, autoplay } = props;
    return (
      <div className={`testimonials d-flex col-12 justify-center ${background_color}`}>
        <div className={cn("transparent-container col-12 relative", { single: quotes.length === 1 })}>
            <LogoOutline className="absolute logo-outline" />
          <Slider
            slidesPerPage={1}
            slidesPerPageM={1}
            slidesPerPageL={1}
            trackClassName="col-md-10 col-md-offset-1"
            peek={false}
            autoplay={autoplay}
          >
            {quotes.map((block, i) => (
              <div className="testimonial-focus" key={i}>
                {block.quote && <h2 className="subtitle-2 quote" dangerouslySetInnerHTML={{ __html: block.quote }} />}
                {block.attribution && <h5 className="display-5 attribution uppercase" dangerouslySetInnerHTML={{ __html: block.attribution }} />}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    )
}