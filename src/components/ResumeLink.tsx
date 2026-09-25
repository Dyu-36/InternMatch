'use client';

import { useT } from '@/context/LocaleContext';
import { useState } from 'react';
import { getResumeUrl } from '@/app/actions';
import { Button } from '@/components/shadcn/button';

export function ResumeLink({ path, name }: { path?: string; name?: string }) {
  const t = useT();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (!path) return <span>{t("Chưa có CV")}</span>;
  return <span>{url ? <a href={url} target="_blank" rel="noopener noreferrer" className="company-inline-link" onClick={() => setTimeout(() => setUrl(''), 1000)}>{t("Mở")} {name || 'CV'}</a> : <Button type="button" variant="link" className="company-inline-link h-auto p-0" disabled={busy} onClick={async () => {
    setBusy(true); setError('');
    try { const result = await getResumeUrl(path); if (result.error) setError(result.error); else setUrl(result.data ?? ''); }
    catch { setError(t("Không thể mở CV. Vui lòng thử lại.")); }
    finally { setBusy(false); }
  }}>{busy ? t("Đang tải…") : `${t('Xem')} ${name || 'CV'}`}</Button>}{error && <span className="ui-error" role="alert">{t(error)}</span>}</span>;
}
