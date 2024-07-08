import { parseLink } from "@/core/utils";
import "./index.scss";

export default function GradientButton(props: ButtonProps) {
  const { url, onClick , label } = props;
  const TagName = url ? 'a' : 'button';
  const handleClick = () => {
    if (onClick) onClick();
  }
  return (
    <TagName onClick={handleClick} href={url ? parseLink(url) : ''} className="gradient-button button-text" dangerouslySetInnerHTML={{ __html: label }}/>
  )
}