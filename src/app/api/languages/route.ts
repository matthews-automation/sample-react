import { NextResponse } from "next/server";
import { CACHE_OPTIONS } from "@/core/constants";

export const GET = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const url = `${baseUrl}/wp-json/matthews/v1/languages/`;
  const res = await fetch(url, CACHE_OPTIONS).then(res => res.json());
  if (!res.success) return NextResponse.json({ message: 'error' }, { status: 400 });
  return NextResponse.json(res.data || null);
};