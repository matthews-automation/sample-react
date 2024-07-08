import InlineButton from "@/components/Buttons/InlineButton";
import Link from "./Link";

import "./index.scss";

export default function LinkListing(props: LinkListingProps) {
  const { headline, sub_header, cta, links } = props;
  return (
    <div className="comp-padding link-listing">
      <div className="container">
        <div className="row heading-lockup">
          <div className="col-12">
            <h4 className="display-4 uppercase col-12" dangerouslySetInnerHTML={{ __html: headline }}/>                
          </div>
          <div className="col-12 col-md-6">
            <p className="body sub-header opacity-70" dangerouslySetInnerHTML={{ __html: sub_header }} />
          </div>
          <div className="col-12 col-md-6 d-md-flex justify-end">
            {cta && <InlineButton label={cta.title} url={cta.url} />}
          </div>
        </div>
        {links &&
          links.map((link, index) => (
            <Link
              key={index}
              title={link.title}
              info={link.info}
              image={link.image}
              link={link.link}
            />
          ))
        }
      </div>
    </div>
  );
}
