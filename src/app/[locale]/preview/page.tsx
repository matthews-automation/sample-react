"use client";
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react';

const Preview = () => {
  const [preview, setPreview] = useState<any>(null);
  const params = useSearchParams();
  const p = params.get('p');


  const redirect_uri = `${process.env.NEXT_PUBLIC_FE_URL}/api/auth?p=${p}`;
  useEffect(() => {
    if (!p) return;
    const query = params.toString();
    fetch(`${process.env.NEXT_PUBLIC_FE_URL}/api/preview?${query}`).then(res => res.json()).then((data) => {
      setPreview(data.pageData);
    }).catch(e => {
      const auth_url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/generate?redirect_uri=${redirect_uri}`;
      window.location.href = auth_url;
    });
  }, []);
  if (!preview) return <>Loading...</>;
  return (
    <div className="page">
      {
        <main className="container">
          <h1>Le preview Page - {preview.title.rendered}</h1>
        </main>
      }
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense>
      <Preview />
    </Suspense>
  )
}
