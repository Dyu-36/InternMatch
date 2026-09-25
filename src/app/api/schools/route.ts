import { NextResponse } from 'next/server';

type UpstreamSchool = {
  name?: string;
  country?: string;
  domains?: string[];
  'state-province'?: string | null;
  web_pages?: string[];
};

const SCHOOLS_API = 'http://universities.hipolabs.com/search';

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams.get('search')?.trim() ?? '';
  const url = new URL(SCHOOLS_API);
  url.searchParams.set('country', 'Vietnam');
  if (search) url.searchParams.set('name', search);

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return NextResponse.json({ error: 'Không thể tải danh sách trường.' }, { status: 502 });

    const schools = await response.json() as UpstreamSchool[];
    const result = schools
      .filter((school) => school.name && school.country === 'Vietnam')
      .slice(0, 20)
      .map((school) => ({
        id: school.domains?.[0] ?? school.name,
        code: school.domains?.[0] ?? '',
        name: school.name,
        type: 'university',
        province: school['state-province'] ?? '',
        website: school.web_pages?.[0] ?? '',
      }));

    return NextResponse.json(result, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
  } catch {
    return NextResponse.json({ error: 'Không thể kết nối tới danh sách trường.' }, { status: 502 });
  }
}
