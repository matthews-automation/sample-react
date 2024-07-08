export const POST = async (request: Request, { params }: { params: { name: string; } }) => {
  const req = await request.json()
  const { name } = params;
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const res = await fetch(`${baseUrl}/wp-json/matthews/v1/submit-${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...req }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}