// Shared shapes for the Vietnamese administrative dataset in `@/data/vn-divisions.json`.
// Types only, so client components can import them without pulling the dataset bundle.
export interface VnWard {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
}

export interface VnProvince {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  wards: VnWard[];
}

export interface VnLocation {
  provinceCode: string;
  wardCode: string;
  addressDetail: string;
}

export type VnLocationField = keyof VnLocation;
