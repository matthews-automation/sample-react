
import { RT_COOKIE } from "@/core/constants";
import { getTokensFromRefreshToken } from "@/core/faust";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const cookieStore = cookies();
  const searchParams = new URL(request.nextUrl).searchParams;
  const refreshToken = cookieStore.get(RT_COOKIE)?.value;
  if (!refreshToken) return NextResponse.json({ message: 'error' }, { status: 401 });
  const tokens = await getTokensFromRefreshToken(refreshToken);
  if (!tokens.accessToken) return NextResponse.json({ message: 'error' }, { status: 401 });
  const id = searchParams.get('p');
  const headers = { headers: { Authorization: `Basic ${tokens.accessToken}` } };
  const baseUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages`;
  const revisionsURL = `${baseUrl}/${id}/revisions?acf_format=standard`;
  const revisions = await fetch(revisionsURL, headers);
  const data = await revisions.json();
  return NextResponse.json({ pageData: data[0] });
};