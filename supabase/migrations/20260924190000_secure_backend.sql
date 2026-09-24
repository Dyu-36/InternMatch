-- Account creation is atomic with Auth. Roles and ownership cannot be changed by clients.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  account_role text := new.raw_user_meta_data->>'role';
  account_name text := lower(trim(new.raw_user_meta_data->>'username'));
begin
  if account_role not in ('STUDENT', 'COMPANY') or account_role is null
     or account_name is null or account_name !~ '^[a-z0-9_]{3,32}$' then
    raise exception 'Invalid account details';
  end if;
  insert into public.profiles(id, username, email, role, name)
  values(new.id, account_name, new.email, account_role, account_name);
  if account_role = 'STUDENT' then
    insert into public.student_profiles(user_id, full_name, expected_graduation_year)
    values(new.id, account_name, extract(year from now())::integer);
  else
    insert into public.company_profiles(user_id, company_name) values(new.id, account_name);
  end if;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.account_role()
returns text language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = (select auth.uid());
$$;
revoke all on function public.account_role() from public;
grant execute on function public.account_role() to authenticated;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists profiles_insert on public.profiles;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update(name, avatar_url) on public.profiles to authenticated;

drop policy if exists student_profiles_insert on public.student_profiles;
drop policy if exists company_profiles_insert on public.company_profiles;
revoke all on public.student_profiles, public.company_profiles from anon, authenticated;
grant select on public.student_profiles to authenticated;
grant select on public.company_profiles to anon, authenticated;
grant update(full_name, avatar_url, cv_url, cv_file_name, university, major, expected_graduation_year, gpa, skills, goals) on public.student_profiles to authenticated;
grant update(company_name, tax_code, industry, company_size, email, hotline, address, city, website, logo_url, description) on public.company_profiles to authenticated;

drop policy if exists jobs_insert on public.jobs;
create policy jobs_insert on public.jobs for insert to authenticated
with check (company_id = (select auth.uid()) and public.account_role() = 'COMPANY');
revoke all on public.jobs from anon, authenticated;
grant select on public.jobs to anon, authenticated;
grant insert, delete on public.jobs to authenticated;
grant update(title, industry, job_type, location, min_salary, max_salary, skills, description, requirements, benefits, is_hot, is_featured, quota, deadline) on public.jobs to authenticated;

alter table public.jobs add constraint jobs_salary_valid check (min_salary >= 0 and max_salary >= min_salary);
alter table public.jobs add constraint jobs_quota_valid check (quota > 0);
alter table public.jobs add constraint jobs_type_valid check (job_type in ('Full-time', 'Part-time', 'Remote', 'Thực tập Toàn thời gian', 'Thực tập Bán thời gian'));
alter table public.student_profiles add constraint student_gpa_valid check (gpa >= 0 and gpa <= 4);

drop policy if exists applications_insert on public.applications;
create policy applications_insert on public.applications for insert to authenticated
with check (student_id = (select auth.uid()) and public.account_role() = 'STUDENT' and status = 'PENDING'
  and exists(select 1 from public.jobs where id = job_id and (deadline is null or deadline >= current_date)));
revoke all on public.applications from anon, authenticated;
grant select, insert on public.applications to authenticated;
grant update(status) on public.applications to authenticated;

-- Copy identity and applicant data from trusted rows even for direct REST requests.
create or replace function public.prepare_application()
returns trigger language plpgsql security definer set search_path = '' as $$
declare student public.student_profiles;
begin
  select * into student from public.student_profiles where user_id = new.student_id;
  if not found or trim(student.full_name) = '' or trim(student.university) = '' or trim(student.major) = '' or cardinality(student.skills) = 0 then
    raise exception 'Complete your student profile before applying';
  end if;
  new.student_name := student.full_name;
  new.student_university := student.university;
  new.student_major := student.major;
  new.student_gpa := student.gpa;
  new.student_skills := student.skills;
  new.cv_url := student.cv_url;
  new.cv_file_name := student.cv_file_name;
  new.applied_at := current_date;
  return new;
end;
$$;
revoke all on function public.prepare_application() from public, anon, authenticated;
create trigger application_snapshot before insert on public.applications
for each row execute function public.prepare_application();

create or replace function public.prepare_job()
returns trigger language plpgsql security definer set search_path = '' as $$
declare company public.company_profiles;
begin
  select * into company from public.company_profiles where user_id = new.company_id;
  if not found then raise exception 'Company profile required'; end if;
  new.company_name := company.company_name;
  new.company_logo := company.logo_url;
  new.company_initial := upper(left(company.company_name, 1));
  return new;
end;
$$;
revoke all on function public.prepare_job() from public, anon, authenticated;
create trigger job_company_details before insert or update on public.jobs
for each row execute function public.prepare_job();

create or replace function public.sync_company_jobs()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.jobs set company_name = new.company_name, company_logo = new.logo_url,
    company_initial = upper(left(new.company_name, 1)) where company_id = new.user_id;
  return new;
end;
$$;
revoke all on function public.sync_company_jobs() from public, anon, authenticated;
create trigger sync_company_jobs after update of company_name, logo_url on public.company_profiles
for each row execute function public.sync_company_jobs();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end;
$$;
create trigger touch_profiles before update on public.profiles for each row execute function public.touch_updated_at();
create trigger touch_student_profiles before update on public.student_profiles for each row execute function public.touch_updated_at();
create trigger touch_company_profiles before update on public.company_profiles for each row execute function public.touch_updated_at();
create trigger touch_jobs before update on public.jobs for each row execute function public.touch_updated_at();

-- CV access is limited to its owner and companies that received that exact CV.
create policy resumes_applicant_company_read on storage.objects for select to authenticated using (
  bucket_id = 'resumes' and exists (
    select 1 from public.applications a where a.cv_url = name and public.is_company_owner(a.job_id)
  )
);
drop policy if exists profile_files_update on storage.objects;
create policy profile_files_update on storage.objects for update to authenticated
using (bucket_id in ('avatars', 'company-logos', 'resumes') and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id in ('avatars', 'company-logos', 'resumes') and (storage.foldername(name))[1] = (select auth.uid())::text);
update storage.buckets set file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'] where id in ('avatars','company-logos');
update storage.buckets set file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'] where id = 'resumes';

alter table public.student_profiles add constraint cv_owner_path check (cv_url is null or split_part(cv_url, '/', 1) = user_id::text);
notify pgrst, 'reload schema';
