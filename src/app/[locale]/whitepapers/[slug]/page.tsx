import { Metadata } from "next";
import { notFound } from "next/navigation";
import api from "@/core/api";
import { getBlogMetaData, getLocale } from "@/core/utils";
import BlogDetail from "@/components/BlogDetail";

type Props = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return await getBlogMetaData({ ...params, type: "whitepapers" });
}

export default async function BlogPostPage({ params }: Props) {
  const locale = getLocale(params.locale);
  const { slug } = params;
  const data = await api.getInsight<BlogPage>(locale, slug, "whitepapers");
  if (!data) notFound();
  return <BlogDetail {...data} />;
}
