import { NextRequest, NextResponse } from "next/server";
import { CACHE_OPTIONS } from "@/core/constants";

export const GET = async (request: NextRequest, { params }: { params: { locale: string; } }) => {
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const query = searchParams.get('query');
  const { locale } = params;
  if (!locale || !query) return NextResponse.json({ message: 'missing required params' }, { status: 401 });
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const url = `${baseUrl}/wp-json/matthews/v1/search?lang=${locale}&${searchParams.toString()}`;
  const data = await fetch(url, CACHE_OPTIONS).then((res) => res.json());
  if (!data.success) return NextResponse.json({ message: 'error' }, { status: 400 });
  return NextResponse.json(data.data);
};