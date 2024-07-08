import { revalidatePath } from 'next/cache';

export const OPTIONS = async (request: Request) => {
  const temp = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}`;
  console.log(request.headers.entries(), 'options');
  return Response.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Key",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};
 
export const GET = async (request: Request) => {
  console.log('revalidating', request);
  await revalidatePath('/', 'layout');
  return Response.json({ revalidated: true, now: Date.now() })
}