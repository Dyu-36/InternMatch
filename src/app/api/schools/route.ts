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
  const schoolsById = new Map<string, DirectorySchool>();
  const schoolsByName = new Map<string, DirectorySchool>();

  const directory = [
    ...upstreamSchools
      .filter((school) => !(hasCurrentHust && school.domains?.includes('hut.edu.vn')))
      .map(fromUpstreamSchool)
      .filter((school): school is DirectorySchool => Boolean(school)),
    ...LOCAL_SCHOOLS.map(fromLocalSchool),
  ];

  for (const school of directory) {
    // Abbreviations and admission codes can be shared by unrelated schools or campuses.
    // Only match identities by ID, full name, or an explicitly known alternate name.
    const names = [school.name, ...(SCHOOL_ALIASES[school.id] ?? [])].map(schoolKey);
    const existing = schoolsById.get(school.id) ?? names.map((name) => schoolsByName.get(name)).find(Boolean);
    const canonical = existing ?? school;
    if (existing) existing.searchTerms = [...new Set([...existing.searchTerms, ...school.searchTerms])];
    else schoolsById.set(school.id, school);
    names.forEach((name) => schoolsByName.set(name, canonical));
  }

  const result = [...schoolsById.values()]
    .filter((school) => !search || school.searchTerms.some((term) => normalizeSearch(term).includes(search)))
    .map(({ id, code, name, type, province, website }) => ({ id, code, name, type, province, website }))
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'));

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600' },
  });
}
