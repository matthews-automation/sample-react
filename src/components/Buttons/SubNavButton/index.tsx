import cn from "classnames";
import Link from "next/link";
import Arrow from "@/assets/icons/right-arrow.svg";
import { parseLink } from "@/core/utils";

import "./index.scss";

export default function SubNavButton(props: ButtonProps) {
  const { url, label, onClick, variant } = props;
  const TagName = onClick ? "button" : Link;
  const tagProps: any = { className: cn("sub-nav-button", variant) };

  if (onClick) tagProps["onClick"] = onClick;
  else if (url) tagProps["href"] = parseLink(url);

  return (
    <TagName {...tagProps}>
      <div className="text-box justify-between align-center">
        <div className="ripple"></div>
        <span className="uppercase button-small" dangerouslySetInnerHTML={{ __html: label }} />
        <div className="sub-nav-button__arrow">
          <Arrow />
        </div>
      </div>
    </TagName>
  );
}
