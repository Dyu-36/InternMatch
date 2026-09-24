'use client';

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <html lang="vi"><body style={{ fontFamily: 'sans-serif', padding: '10vh 24px', textAlign: 'center' }}>
    <h1>Không thể tải InternMatch / Unable to load InternMatch</h1>
    <p>Vui lòng thử lại sau ít phút. / Please try again in a moment.</p>
    <button onClick={() => retry()} style={{ padding: '12px 24px', cursor: 'pointer' }}>Thử lại / Retry</button>
  </body></html>;
}
