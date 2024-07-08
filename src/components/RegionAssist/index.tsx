"use client";
import "./index.scss";
import Close from "@/assets/icons/close.svg";
import SecondaryButton from "../Buttons/SecondaryButton";
import { replaceRegionAssistLanguages } from "@/core/utils";
import { useState } from "react";

export default function RegionAssist (props: {content: SiteOptions["region_assist"]}) {
    const [showRegionAssist, setShowRegionAssist] = useState(true);
    const { headline, body, buttons} = props.content;
    
    const handleClick = (change: boolean) => {
        setShowRegionAssist(false);
    }
    return (
        <>
        {showRegionAssist &&
            <div className="region-assist-container d-flex flex-column">
                <div className="content d-flex flex-column">
                    <span className="uppercase headline-span" dangerouslySetInnerHTML={{ __html: headline }}/>
                    <span className="body-span" dangerouslySetInnerHTML={{ __html: body }}/>
                </div>
                <div className="region-assist-container__button-container d-flex">
                    <SecondaryButton label={buttons.yes} onClick={() => handleClick(true)}/>
                    <SecondaryButton label={buttons.no} className="region-assist-no" onClick={() => handleClick(false)}/>
                </div>
                <div className="region-assist-exit-button" onClick={() => handleClick(false)}>
                    <Close />
                </div>
            </div> 
        }
        </>
    )
}