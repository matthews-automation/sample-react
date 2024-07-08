import { NextRequest, NextResponse } from "next/server";
import { CACHE_OPTIONS } from "@/core/constants";

export const GET = async (request: NextRequest, { params }: { params: { locale: string; name: string[]; } }) => {
  const searchParams = request.nextUrl.searchParams;
  const { locale } = params;
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (!locale) return NextResponse.json({ message: 'missing required params' }, { status: 401 });
  const url = `${baseUrl}/wp-json/matthews/v1/insights?lang=${locale}&${searchParams.toString()}`;
  const data = await fetch(url, CACHE_OPTIONS).then((res) => res.json());
  if (!data.success) return NextResponse.json({ message: 'error' }, { status: 400 });
  return NextResponse.json(data.data);
};