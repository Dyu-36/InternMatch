'use client';

import { Button } from '@/components/shadcn/button';

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <html lang="vi"><body style={{ fontFamily: 'sans-serif', padding: '10vh 24px', textAlign: 'center' }}>
    <h1>Không thể tải InternMatch / Unable to load InternMatch</h1>
    <p>Vui lòng thử lại sau ít phút. / Please try again in a moment.</p>
    <Button onClick={() => retry()} className="bg-emerald-600 text-white hover:bg-emerald-700">Thử lại / Retry</Button>
  </body></html>;
}
