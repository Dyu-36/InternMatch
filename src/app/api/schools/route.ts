import { NextResponse } from 'next/server';

type UpstreamSchool = {
  name?: string;
  country?: string;
  alpha_two_code?: string;
  domains?: string[];
  'state-province'?: string | null;
  web_pages?: string[];
};

const SCHOOLS_API = 'http://universities.hipolabs.com/search';

// Search aliases only: results still come from the live directory, never mock rows.
// Names verified at https://www.hust.edu.vn/vi/about/tong-quan.html and https://htqt.ftu.edu.vn/.
const SCHOOL_ALIASES: Record<string, string[]> = {
  'hust.edu.vn': ['HUST', 'HUT', 'Đại học Bách khoa Hà Nội', 'Trường Đại học Bách khoa Hà Nội', 'ĐHBKHN', 'hut.edu.vn', 'Hanoi University of Technology'],
  'ftu.edu.vn': ['FTU', 'Đại học Ngoại thương', 'Trường Đại học Ngoại thương', 'ĐHNT'],
};

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/\s+/g, ' ').trim();
}

async function fetchSchools(country: string): Promise<UpstreamSchool[]> {
  const url = new URL(SCHOOLS_API);
  url.searchParams.set('country', country);
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('School directory unavailable');
  const schools: unknown = await response.json();
  if (!Array.isArray(schools)) throw new Error('Invalid school directory response');
  return schools;
}

export async function GET(request: Request) {
  const search = normalizeSearch(new URL(request.url).searchParams.get('search') ?? '');

  try {
    // The upstream directory splits VN between these two country spellings.
    // Load both before filtering; searching upstream by name misses acronyms/domains.
    const groups = await Promise.all(['Vietnam', 'Viet Nam'].map(fetchSchools));
    const schools = groups.flat().filter((school) => school && typeof school.name === 'string' && school.name.trim() &&
      (school.alpha_two_code === 'VN' || ['Vietnam', 'Viet Nam'].includes(school.country ?? '')));
    const hasCurrentHust = schools.some((school) => school.domains?.includes('hust.edu.vn'));
    const seenNames = new Set<string>();
    const seenDomains = new Set<string>();
    const result = schools
      .filter((school) => {
        if (hasCurrentHust && school.domains?.includes('hut.edu.vn')) return false;
        const name = normalizeSearch(school.name!);
        const domains = school.domains ?? [];
        if (seenNames.has(name) || domains.some((domain) => seenDomains.has(domain))) return false;
        seenNames.add(name);
        domains.forEach((domain) => seenDomains.add(domain));
        return true;
      })
      .filter((school) => {
        const domains = school.domains ?? [];
        const terms = [school.name!, ...domains, ...domains.flatMap((domain) => SCHOOL_ALIASES[domain] ?? [])];
        return !search || terms.some((term) => normalizeSearch(term).includes(search));
      })
      .map((school) => ({
        id: school.domains?.[0] ?? school.name,
        code: school.domains?.[0] ?? '',
        name: school.name,
        type: 'university',
        province: school['state-province'] ?? '',
        website: school.web_pages?.[0] ?? '',
      }))
      .sort((a, b) => a.name!.localeCompare(b.name!, 'en'));

    return NextResponse.json(result, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
  } catch {
    return NextResponse.json({ error: 'Không thể kết nối tới danh sách trường.' }, { status: 502 });
  }
}
