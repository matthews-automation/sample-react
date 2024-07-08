import InlineButton from "../Buttons/InlineButton";
import cn from "classnames";

import "./index.scss";

export default function FeatureCards(props: FeatureCardProps) {
    const { headline, description, cta, cards, layout } = props;
    let cardClass = 'col-md-3 col-12';
    const showHeader = headline || description || cta;
    if (cards.length === 3) cardClass = 'col-md-4 col-12';
    if (cards.length === 2) cardClass = 'col-md-6 col-12';
    if (cards.length === 1) cardClass = 'col-12';
    return (
        <div className="features-icons">
            <div className="container comp-padding">

               { showHeader && <div className='row'>
                    <div className='heading-lockup col-12'>
                        {headline && <h4 className="display-4 uppercase" dangerouslySetInnerHTML={{ __html: headline }}/>}
                        <div className="d-md-flex justify-between sub-header">
                            {description && <p className="body col-md-6 col-12 opacity-70" dangerouslySetInnerHTML={{ __html: description }}/>}
                            {cta && <InlineButton url={cta.url} label={cta.title} />}
                        </div>
                    </div>
                </div>
               }

                <div className="row">
                    <div className={`feature-cards-container inner-comp`}>
                        {cards.map((item, i) => (
                            <div key={i} className={cn('card', cardClass)}>
                                <div className="feature-card flex-column">
                                    <div className="icon-text">
                                        {layout === "font" && item.xl_text && <h1 className="xl-font" dangerouslySetInnerHTML={{ __html: item.xl_text }}/>}
                                        {layout === "icon" && item.icon.url && <img className="" src={item.icon.url} alt="" />}
                                        <div className="text-content">
                                            {item.headline && <h5 className="subtitle-5" dangerouslySetInnerHTML={{ __html: item.headline }}/>}
                                            {item.description && <p className="body feature-card-body" dangerouslySetInnerHTML={{ __html: item.description }}/>}
                                        </div>
                                    </div>
                                </div>
                                <div className="block-border"></div>
                            </div> 
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}