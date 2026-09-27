import { NextResponse } from 'next/server';
import { VN_PROVINCES } from '@/lib/vn-divisions';

const HEADERS = { 'Cache-Control': 'public, max-age=0, s-maxage=3600' };

// Serves the bundled administrative dataset so the address pickers never ship
// 3,321 wards to the browser: provinces first, then the wards of one province.
export async function GET(request: Request) {
  const provinceCode = new URL(request.url).searchParams.get('province')?.trim() ?? '';
  if (!provinceCode) {
    return NextResponse.json(
      VN_PROVINCES.map(({ code, name, nameEn, fullName, wards }) => ({ code, name, nameEn, fullName, wardCount: wards.length })),
      { headers: HEADERS },
    );
  }
  const province = VN_PROVINCES.find((candidate) => candidate.code === provinceCode);
  if (!province) return NextResponse.json({ error: 'Mã tỉnh / thành phố không hợp lệ.' }, { status: 400, headers: HEADERS });
  return NextResponse.json(province.wards.map(({ code, name, nameEn }) => ({ code, name, nameEn })), { headers: HEADERS });
}
