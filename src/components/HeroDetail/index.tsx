"use client";
import { useRef } from "react";
import Hyphenated from 'react-hyphen';
import ImageParallax from "../ImageParallax";
import InlineButton from "../Buttons/InlineButton";
import { useScroll } from "@/providers/scroll-pos";
import { useOptions } from "@/providers/options";

import "./index.scss";

export default function HeroDetail( props: { HeroDetailProps: HeroDetailProps, includeSubNav: boolean }) {
    const { HeroDetailProps, includeSubNav } = props;
    const { eyebrow, headline, sub_header, background, variant, option_png_image, png_image } = HeroDetailProps;
    const { scrollPos } = useScroll();
    const heroDetailRef = useRef<HTMLDivElement | null>(null);
    const { options: { continue_cta } } = useOptions();
    
    const handleScrollDown = () => {
        if (!heroDetailRef.current) return;
        const rect = heroDetailRef.current.getBoundingClientRect();
        let height = rect.height + rect.top + scrollPos
        if (includeSubNav) {
            height += heroDetailRef.current.nextElementSibling?.getBoundingClientRect().height || 0;
        }
        window.scrollTo({ top: height, behavior: "smooth" });
    }

    const lightText = variant === "Light" ? true : false;

    return (
        <div className="hero-detail" ref={heroDetailRef}>
            <div className="hero-detail__box relative">
                {!option_png_image &&<ImageParallax imageUrl={background?.url} classes={["background-img", "detail-hero"]} />}
                {option_png_image &&
                <>
                    <img className="png-image col-md-offset-6 col-md-6 col-offset-0 col-12" src={png_image.url} />
                    <div className="absolute col-12 background-gradient"></div>
                </>
                }
                {!option_png_image && <div className="absolute col-12 transparent-background-gradient"></div>}
                <div className="absolute heading row justify-between align-end">
                    <div className="col-md-6 heading__content">
                        <p className="eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }}/>
                        <Hyphenated>
                            <h3 className="heading__content__header display-3" style={option_png_image ? { color: 'black' } : undefined} dangerouslySetInnerHTML={{ __html: headline }}/>
                        </Hyphenated>
                        <p className="body opacity-70" style={option_png_image ? { color: 'black' } : undefined} dangerouslySetInnerHTML={{ __html: sub_header }}/>
                    </div>
                    {!option_png_image && <div className="col-12 col-md-6 d-flex justify-end ">
                        <InlineButton onClick={handleScrollDown} label={continue_cta} arrowDirection="down" lightLabel={lightText}/>
                    </div>}
                </div>
            </div> 
        </div>
    )
}