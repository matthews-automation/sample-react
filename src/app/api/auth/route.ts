import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { RT_COOKIE } from "@/core/constants";
import { getTokensFromCode, getTokensFromRefreshToken } from "@/core/faust";

const getTokens = async (access: string, isCode = false) => {
  if (isCode) return await getTokensFromCode(access);
  return await getTokensFromRefreshToken(access);
}

export const GET = async (request: NextRequest) => {
  const searchParams = new URL(request.nextUrl).searchParams;
  const cookieStore = cookies();
  const refreshToken = cookieStore.get(RT_COOKIE)?.value;
  const code = searchParams.get('code');
  let tokens: { accessToken: string; refreshToken: string; accessTokenExpiration: number; refreshTokenExpiration: number; }
  if (!code && !refreshToken) return NextResponse.json({ message: 'error' }, { status: 401 });
  try {
    tokens = await getTokens(code || refreshToken!, !!code);
    if (!tokens.accessToken || !tokens.refreshToken) throw new Error('Invalid tokens');
    cookieStore.set(RT_COOKIE, tokens.refreshToken, {
      secure: true,
      httpOnly: true,
      path: '/',
      expires: new Date(tokens.refreshTokenExpiration * 1000),
      sameSite: 'lax',
    });
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FE_URL}/preview?p=${searchParams.get('p')}`);
  } catch (error) {
    return NextResponse.json({ message: 'error' }, { status: 401 });
  }
};