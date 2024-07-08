import "./index.scss";
import ChevronUp from "../../assets/icons/chevron-up.svg";
import { useEffect, useState } from "react";
import { parseLink } from "@/core/utils";

export default function AccordionItem({
  index,
  title,
  menuTitle,
  itemsList,
  clicked,
  single = true,
  onClick,
  children,
}: AccordionItemProps) {
  const [internalClicked, setInternalClicked] = useState(false);
  const handleClick = () => {
    // Uncomment this line to control accordion items from parent component - MA
    // if (onClick && index !== undefined) onClick(index); 
    if (single) setInternalClicked(!internalClicked);
  };
  // Uncomment this line to control accordion items from parent component - MA
  // useEffect(() => { if (!single) setInternalClicked(clicked!); }, [clicked])

  return (
    <div onClick={handleClick} className={`accordion-item ${internalClicked ? "clicked" : ""}`}>
      <div className="d-flex justify-between align-center">
        {title && <h6 className="subtitle-5 title" dangerouslySetInnerHTML={{ __html: title }} />}
        {menuTitle && <h6 className="menuTitle uppercase" dangerouslySetInnerHTML={{ __html: menuTitle }} />}

        <div className={`accordion-button ${internalClicked ? "clicked" : ""}`}>
          {internalClicked ? <ChevronUp /> : <ChevronUp />}
        </div>
      </div>
      <div className={`more-info ${internalClicked ? "clicked" : ""}`}>
        <div className="content">
          {itemsList &&
            itemsList.map((item, index) => (
              <a href={parseLink(item.link)} key={index}>
                <h6 className="subtitle-5 title">{item.name}</h6>
              </a>
            ))}

          {children && children}
          
        </div>
      </div>
    </div>
  );
}