import { NextRequest, NextResponse } from "next/server";
import { CACHE_OPTIONS } from "@/core/constants";

export const GET = async (_request: NextRequest, { params }: { params: { locale: string; name: string; } }) => {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const { locale, name } = params;
  if (!name || !locale) return NextResponse.json({ message: 'missing required params' }, { status: 401 });
  const url = `${baseUrl}/wp-json/matthews/v1/get-menu/?menu=${name}&lang=${locale}`;
  const res = await fetch(url, CACHE_OPTIONS).then(res => res.json());
  if (!res.success) return NextResponse.json({ message: 'error' }, { status: 400 });
  return NextResponse.json([ ...res.data ]);
};