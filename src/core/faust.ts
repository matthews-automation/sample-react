type Tokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
}

const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function getTokensFromCode(code: string): Promise<Tokens> {
  const apiClientSecret = process.env.FAUST_SECRET_KEY;
  if (!apiClientSecret) throw new Error('The faust_secret_key must be specified to use the auth middleware');
  let response = await fetch(`${wpBaseUrl}/?rest_route=/faustwp/v1/authorize`, {
    headers: {
      'Content-Type': 'application/json',
      'x-faustwp-secret': apiClientSecret,
    },
    method: 'POST',
    body: JSON.stringify({
      code
    }),
  });
  const tokens: Tokens = await response.json();
  return tokens;
}

export async function getTokensFromRefreshToken(refreshToken: string): Promise<Tokens> {
  const apiClientSecret = process.env.FAUST_SECRET_KEY;
  if (!apiClientSecret) throw new Error('The faust_secret_key must be specified to use the auth middleware');
  let response = await fetch(`${wpBaseUrl}/?rest_route=/faustwp/v1/authorize`, {
    headers: { 'Content-Type': 'application/json', 'x-faustwp-secret': apiClientSecret },
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  });
  const tokens: Tokens = await response.json();
  return tokens;
}