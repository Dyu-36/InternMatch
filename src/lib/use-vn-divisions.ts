'use client';

import { useEffect, useState } from 'react';
import type { VnWardLevel } from './vn-divisions-types';

export interface VnProvinceOption { code: string; name: string; nameEn: string; fullName: string; wardCount: number; }
export interface VnWardOption { code: string; name: string; nameEn: string; fullName: string; level: VnWardLevel; }
export type VnDivisionOption = VnProvinceOption | VnWardOption;

export interface VnDivisionsState<T extends VnDivisionOption> {
  options: T[];
  loading: boolean;
  failed: boolean;
}

// Request cache keyed by query: the administrative dataset never changes at
// runtime, and every page with an address picker needs the province list.
const requests = new Map<string, Promise<VnDivisionOption[]>>();

function loadDivisions<T extends VnDivisionOption>(url: string): Promise<T[]> {
  const cached = requests.get(url) as Promise<T[]> | undefined;
  if (cached) return cached;
  const request = fetch(url).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json() as Promise<T[]>;
  }).catch((error: unknown) => {
    requests.delete(url);
    throw error;
  });
  requests.set(url, request);
  return request;
}

// The loaded result is tagged with its query, so switching province renders the
// pending state from the current `url` instead of a synchronous state update.
function useDivisions<T extends VnDivisionOption>(url: string | null) {
  const [state, setState] = useState<{ key: string | null; options: T[]; failed: boolean }>({ key: null, options: [], failed: false });

  useEffect(() => {
    if (!url) return;
    let active = true;
    loadDivisions<T>(url).then(
      (options) => { if (active) setState({ key: url, options, failed: false }); },
      () => { if (active) setState({ key: url, options: [], failed: true }); },
    );
    return () => { active = false; };
  }, [url]);

  if (state.key !== url) return { options: [] as T[], loading: Boolean(url), failed: false };
  return { options: state.options, loading: false, failed: state.failed };
}

export function useVnProvinces() {
  return useDivisions<VnProvinceOption>('/api/divisions');
}

export function useVnWards(provinceCode: string) {
  return useDivisions<VnWardOption>(provinceCode ? `/api/divisions?province=${encodeURIComponent(provinceCode)}` : null);
}
