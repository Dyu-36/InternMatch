import 'server-only';

import divisions from '@/data/vn-divisions.json';
import type { VnLocation, VnProvince } from './vn-divisions-types';

// Two-level administrative units in force since 2025-07-01: 34 provinces/cities
// and 3,321 wards/communes. The dataset ships with the repo, so no request ever
// depends on a third-party address API.
export const VN_PROVINCES = divisions.provinces as VnProvince[];

const provinceByCode: Record<string, VnProvince> = {};
for (const province of VN_PROVINCES) provinceByCode[province.code] = province;

export interface ResolvedLocation {
  provinceName: string;
  wardName: string;
  // Public location of a posting: ward then province, without street detail.
  location: string;
  // Company address columns: province name, then ward plus street.
  city: string;
  address: string;
}

// Returns null for an unknown province/ward pair or a ward from another province,
// so callers can reject the submission instead of storing a broken address.
export function resolveLocation({ provinceCode, wardCode, addressDetail }: VnLocation): ResolvedLocation | null {
  const province = provinceByCode[provinceCode];
  const ward = province?.wards.find((candidate) => candidate.code === wardCode);
  if (!province || !ward) return null;
  const street = addressDetail.trim();
  return {
    provinceName: province.name,
    wardName: ward.name,
    location: `${ward.fullName}, ${province.name}`,
    city: province.name,
    address: street ? `${ward.fullName}, ${street}` : ward.fullName,
  };
}
