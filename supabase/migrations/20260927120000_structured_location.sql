-- Structured location: province (2-digit code) and ward (5-digit code) from the
-- administrative dataset in src/data/vn-divisions.json, effective 2025-07-01.
-- The existing display columns stay and are written by the server from the codes.
alter table public.jobs add column if not exists province_code text;
alter table public.jobs add column if not exists ward_code text;
alter table public.jobs add column if not exists address_detail text not null default '';
alter table public.company_profiles add column if not exists province_code text;
alter table public.company_profiles add column if not exists ward_code text;
alter table public.company_profiles add column if not exists address_detail text not null default '';

create index if not exists jobs_province_code_idx on public.jobs(province_code);
create index if not exists jobs_ward_code_idx on public.jobs(ward_code);

-- Column-level privileges in secure_backend.sql do not cover the new columns.
grant update(province_code, ward_code, address_detail) on public.jobs to authenticated;
grant update(province_code, ward_code, address_detail) on public.company_profiles to authenticated;
