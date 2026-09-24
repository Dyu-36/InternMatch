create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text not null,
  role text not null check (role in ('STUDENT', 'COMPANY')),
  name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  cv_url text,
  cv_file_name text,
  university text not null default '',
  major text not null default '',
  expected_graduation_year integer not null default 0,
  gpa numeric(3,2) not null default 0,
  skills text[] not null default '{}',
  goals text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  company_name text not null default '',
  tax_code text not null default '',
  industry text not null default '',
  company_size text not null default '',
  email text not null default '',
  hotline text not null default '',
  address text not null default '',
  city text not null default '',
  website text not null default '',
  logo_url text,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  company_logo text,
  company_initial text,
  title text not null,
  industry text not null,
  job_type text not null,
  location text not null,
  min_salary integer not null default 0,
  max_salary integer not null default 0,
  skills text[] not null default '{}',
  description text not null,
  requirements text not null,
  benefits text not null,
  is_hot boolean not null default false,
  is_featured boolean not null default false,
  quota integer not null default 1,
  deadline date,
  created_at date not null default current_date,
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  student_name text not null,
  student_university text not null default '',
  student_major text not null default '',
  student_gpa numeric(3,2) not null default 0,
  student_skills text[] not null default '{}',
  cover_letter text,
  cv_url text,
  cv_file_name text,
  status text not null default 'PENDING' check (status in ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED')),
  applied_at date not null default current_date,
  unique(job_id, student_id)
);

create index if not exists jobs_company_id_idx on public.jobs(company_id);
create index if not exists jobs_created_at_idx on public.jobs(created_at desc);
create index if not exists applications_job_id_idx on public.applications(job_id);
create index if not exists applications_student_id_idx on public.applications(student_id);

alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.company_profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

create or replace function public.is_company_owner(target_job_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.jobs where id = target_job_id and company_id = auth.uid());
$$;

create or replace function public.is_job_applicant_company(target_job_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_company_owner(target_job_id);
$$;

 drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (true);
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert with check (id = auth.uid());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

 drop policy if exists student_profiles_select on public.student_profiles;
create policy student_profiles_select on public.student_profiles for select using (
  user_id = auth.uid() or exists(select 1 from public.applications a join public.jobs j on j.id = a.job_id where a.student_id = student_profiles.user_id and j.company_id = auth.uid())
);
drop policy if exists student_profiles_insert on public.student_profiles;
create policy student_profiles_insert on public.student_profiles for insert with check (user_id = auth.uid());
drop policy if exists student_profiles_update on public.student_profiles;
create policy student_profiles_update on public.student_profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());

 drop policy if exists company_profiles_select on public.company_profiles;
create policy company_profiles_select on public.company_profiles for select using (true);
drop policy if exists company_profiles_insert on public.company_profiles;
create policy company_profiles_insert on public.company_profiles for insert with check (user_id = auth.uid());
drop policy if exists company_profiles_update on public.company_profiles;
create policy company_profiles_update on public.company_profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());

 drop policy if exists jobs_select on public.jobs;
create policy jobs_select on public.jobs for select using (true);
drop policy if exists jobs_insert on public.jobs;
create policy jobs_insert on public.jobs for insert with check (company_id = auth.uid());
drop policy if exists jobs_update on public.jobs;
create policy jobs_update on public.jobs for update using (company_id = auth.uid()) with check (company_id = auth.uid());
drop policy if exists jobs_delete on public.jobs;
create policy jobs_delete on public.jobs for delete using (company_id = auth.uid());

 drop policy if exists applications_select on public.applications;
create policy applications_select on public.applications for select using (student_id = auth.uid() or public.is_company_owner(job_id));
drop policy if exists applications_insert on public.applications;
create policy applications_insert on public.applications for insert with check (student_id = auth.uid());
drop policy if exists applications_update on public.applications;
create policy applications_update on public.applications for update using (public.is_company_owner(job_id)) with check (public.is_company_owner(job_id));

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('company-logos', 'company-logos', true), ('resumes', 'resumes', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists company_logos_public_read on storage.objects;
create policy company_logos_public_read on storage.objects for select using (bucket_id = 'company-logos');
drop policy if exists profile_files_insert on storage.objects;
create policy profile_files_insert on storage.objects for insert with check (bucket_id in ('avatars', 'company-logos', 'resumes') and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists profile_files_update on storage.objects;
create policy profile_files_update on storage.objects for update using (bucket_id in ('avatars', 'company-logos', 'resumes') and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists profile_files_delete on storage.objects;
create policy profile_files_delete on storage.objects for delete using (bucket_id in ('avatars', 'company-logos', 'resumes') and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists resumes_owner_read on storage.objects;
create policy resumes_owner_read on storage.objects for select using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);
