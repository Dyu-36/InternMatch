import { NextResponse } from 'next/server';

type UpstreamSchool = {
  id?: string;
  code?: string;
  name?: string;
  type?: string;
  country?: string;
  verified?: boolean;
};

const SCHOOLS_API = 'https://school.vansao.com/openapi/api/v1/schools';

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams.get('search')?.trim() ?? '';
  if (search.length < 2) return NextResponse.json([]);

  const url = new URL(SCHOOLS_API);
  url.searchParams.set('search', search);
  url.searchParams.set('limit', '20');

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return NextResponse.json({ error: 'Không thể tải danh sách trường.' }, { status: 502 });

    const payload = await response.json() as UpstreamSchool[] | { schools?: UpstreamSchool[]; data?: UpstreamSchool[]; items?: UpstreamSchool[] };
    const schools = Array.isArray(payload) ? payload : payload.schools ?? payload.data ?? payload.items ?? [];
    const result = schools
      .filter((school) => school.id && school.name && school.country === 'VN')
      .map((school) => ({ id: school.id, code: school.code ?? '', name: school.name, type: school.type ?? '', verified: Boolean(school.verified) }));

    return NextResponse.json(result, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
  } catch {
    return NextResponse.json({ error: 'Không thể kết nối tới danh sách trường.' }, { status: 502 });
  }
}
