import { NextRequest, NextResponse } from "next/server";
import { CACHE_OPTIONS } from "@/core/constants";

export const GET = async (_request: NextRequest, { params }: { params: { locale: string; } }) => {
  const { locale } = params;
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (!locale) return NextResponse.json({ message: 'missing required params' }, { status: 401 });
  const data = await fetch(`${baseUrl}/wp-json/wp/v2/posts?lang=${locale}`, CACHE_OPTIONS).then((res) => res.json());
  if (!data) return NextResponse.json({ message: 'error' }, { status: 400 });
  return NextResponse.json(data);
};