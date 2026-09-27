// Shared shapes for the Vietnamese administrative dataset in `@/data/vn-divisions.json`.
// Types only, so client components can import them without pulling the dataset bundle.
// "Cấp" from the official workbook, in the order the pickers list them.
export const VN_WARD_LEVELS = ['Phường', 'Xã', 'Đặc khu'] as const;
export type VnWardLevel = (typeof VN_WARD_LEVELS)[number];

export interface VnWard {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  level: VnWardLevel;
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
