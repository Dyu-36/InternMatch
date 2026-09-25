import { NextResponse } from 'next/server';
import vietnamUniversities from '@/data/vietnam-universities.json';

type UpstreamSchool = {
  name?: string;
  country?: string;
  alpha_two_code?: string;
  domains?: string[];
  'state-province'?: string | null;
  web_pages?: string[];
};

type LocalSchool = {
  name: string;
  short_name?: string | null;
  code_university?: string | null;
};

type DirectorySchool = {
  id: string;
  code: string;
  name: string;
  type: 'university';
  searchTerms: string[];
  province?: string;
  website?: string;
};

const SCHOOLS_API = 'http://universities.hipolabs.com/search';
// Snapshot complement for the Vietnamese university directory:
// https://github.com/lehuuhieuak/api-university-vn/blob/master/dataset-universities-vn.json
const LOCAL_SCHOOLS = vietnamUniversities as LocalSchool[];

const SCHOOL_ALIASES: Record<string, string[]> = {
  'hust.edu.vn': ['HUST', 'HUT', 'Đại học Bách khoa Hà Nội', 'Trường Đại học Bách khoa Hà Nội', 'ĐHBKHN', 'Hanoi University of Technology'],
  'ftu.edu.vn': ['FTU', 'Đại học Ngoại thương', 'Trường Đại học Ngoại thương', 'ĐHNT'],
};

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/\s+/g, ' ').trim();
}

function schoolKey(value: string) {
  return normalizeSearch(value).replace(/^truong\s+/, '');
}

function schoolSlug(value: string) {
  return normalizeSearch(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchSchools(country: string): Promise<UpstreamSchool[]> {
  const url = new URL(SCHOOLS_API);
  url.searchParams.set('country', country);
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(7000),
  });
  if (!response.ok) throw new Error('School directory unavailable');
  const schools: unknown = await response.json();
  if (!Array.isArray(schools)) throw new Error('Invalid school directory response');
  return schools;
}

function fromLocalSchool(school: LocalSchool): DirectorySchool {
  const code = school.code_university ?? school.short_name ?? '';
  return {
    id: `vn-${schoolSlug(school.name)}${code ? `-${schoolSlug(code)}` : ''}`,
    code,
    name: school.name.trim(),
    type: 'university',
    searchTerms: [school.name, school.short_name ?? '', school.code_university ?? ''],
  };
}

function fromUpstreamSchool(school: UpstreamSchool): DirectorySchool | null {
  if (!school.name?.trim()) return null;
  const domains = school.domains ?? [];
  return {
    id: domains[0] ?? school.name,
    code: domains[0] ?? '',
    name: school.name.trim(),
    type: 'university',
    searchTerms: [school.name, ...domains, ...domains.flatMap((domain) => SCHOOL_ALIASES[domain] ?? [])],
    province: school['state-province'] ?? '',
    website: school.web_pages?.[0] ?? '',
  };
}

export async function GET(request: Request) {
  const search = normalizeSearch(new URL(request.url).searchParams.get('search') ?? '');
  const upstreamResults = await Promise.allSettled(['Vietnam', 'Viet Nam'].map(fetchSchools));
  const upstreamSchools = upstreamResults.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
  const hasCurrentHust = upstreamSchools.some((school) => school.domains?.includes('hust.edu.vn'));
  const seen = new Set<string>();

  const result = [
    ...upstreamSchools
      .filter((school) => !(hasCurrentHust && school.domains?.includes('hut.edu.vn')))
      .map(fromUpstreamSchool)
      .filter((school): school is DirectorySchool => Boolean(school)),
    ...LOCAL_SCHOOLS.map(fromLocalSchool),
  ]
    .filter((school) => {
      const keys = [school.name, ...school.searchTerms].map(schoolKey).filter(Boolean);
      if (keys.some((key) => seen.has(key))) return false;
      keys.forEach((key) => seen.add(key));
      return true;
    })
    .filter((school) => !search || school.searchTerms.some((term) => normalizeSearch(term).includes(search)))
    .map(({ searchTerms: _searchTerms, ...school }) => school)
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'));

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
  });
}
