import cn from "classnames";
import Link from "next/link";
import Arrow from "@/assets/icons/right-arrow.svg";
import { parseLink } from "@/core/utils";

import "./index.scss";

export default function PrimaryButton(props: ButtonProps) {
  const { url, label, onClick, variant } = props;
  const TagName = onClick ? "button" : Link;
  const tagProps: any = { className: cn("primary-button", variant) };

  if (onClick) tagProps["onClick"] = onClick;
  else if (url) tagProps["href"] = parseLink(url);

  return (
    <TagName {...tagProps}>
      <div className="text-box justify-between d-flex">
        <div className="ripple"></div>
        <span className="uppercase button-large" dangerouslySetInnerHTML={{ __html: label }} />
        <div className="primary-button__arrow">
          <Arrow />
        </div>
      </div>
    </TagName>
  );
}
