import SetActivePage from "@/hooks/set-active-page";
import Section from "@/components/Section";
import BlogHeroDetail from "@/components/BlogHeroDetail";

export default function BlogDetail(props: BlogPage) {
  const { acf, id, post_title, title } = props;
  const { featured_image, sections } = acf;
  return (
    <div className="page">
      <SetActivePage pageID={id} headerLight={false} />
      <BlogHeroDetail
        blog_post_title={post_title || title.rendered}
        blog_post_image={featured_image}
      />
      <div className="comp-padding">
        {sections &&
          sections.map((section, i) => (
            <Section
              key={i}
              section_title={section.section_title}
              section_content={section.section_content}
              expandable_content={section.expandable_content}              
              />
          ))}
      </div>
    </div>
  )
}