import Link from "next/link";
import Arrow from "@/assets/icons/right-arrow.svg";
import DownArrow from "@/assets/icons/down-arrow.svg";
import "./index.scss";
import cn from "classnames";
import { parseLink } from "@/core/utils";

export default function InlineButton(props: ButtonProps) {
  const { url, onClick , label, arrowDirection, lightLabel } = props;
  const TagName = onClick ? "button" : Link;
  const tagProps: any = { className: cn("d-inline-flex inline-btn", lightLabel && "white") };
  if (onClick) tagProps['onClick'] = onClick;
  else if (url) tagProps['href'] = parseLink(url);

  return (
    <>
      <TagName {...tagProps}>
        <div className="d-flex align-center justify-between inline-button-wrap">
          <span className="uppercase button-text" dangerouslySetInnerHTML={{ __html: label }}/>
          <span className="uppercase button-text gradient" dangerouslySetInnerHTML={{ __html: label }}/>
          {(arrowDirection === "down") ? 
            <DownArrow className="inline-arrow down single" /> 
            : 
            <Arrow className="inline-arrow single" />  
          }
        </div>
      </TagName>
    </>
  )
}
