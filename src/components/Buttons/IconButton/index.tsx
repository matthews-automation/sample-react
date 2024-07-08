import Image from "next/image";
import classNames from "classnames";
import { parseLink } from "@/core/utils";

import "./index.scss";

export default function IconButton(props: IconButtonProps) {
  const { icon: Icon, noLink, onClick, url, flip } = props;
  const isIconUrl = typeof Icon === 'string';
  const TagName = noLink ? 'div' : onClick ? 'button' : 'a';
  const tagProps: any = {
    className: classNames('icon-button', flip && 'flip', props.className),
  };
  if (onClick) tagProps['onClick'] = onClick;
  else if (url) {
    tagProps['href'] = parseLink(url);
  }
  return (
    <>
      <TagName { ...tagProps }>
        { isIconUrl ? <Image src={Icon} alt="icon" /> : <Icon /> }
      </TagName>
    </>
  )

}