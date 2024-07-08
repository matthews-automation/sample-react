import "./index.scss";
import ImageParallax from "../ImageParallax";

export default function BlogHeroDetail(props: BlogHeroProps) {
  const { blog_post_image, blog_post_title } = props;
  return (
    <div className="blog-hero">
      <div className="container comp-padding">
        <div className="row align-center flex-md-row flex-column-reverse">
          <div className="col-md-8 col-lg-7 col-12">
            <h3 className="subtitle-1">{blog_post_title}</h3>
          </div>
          <div className="col-md-3 col-md-offset-1 col-lg-offset-2 col-12">
            <ImageParallax imageUrl={blog_post_image} classes={["ratio-5-4"]} />
          </div>
        </div>
      </div>
    </div>
  );
}
