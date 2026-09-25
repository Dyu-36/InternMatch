-- Preserve the applicant avatar at submission time without widening client grants.
alter table public.applications
  add column if not exists student_avatar_url text;

-- Populate snapshots that predate this column.
update public.applications as application
set student_avatar_url = student.avatar_url
from public.student_profiles as student
where student.user_id = application.student_id
  and application.student_avatar_url is distinct from student.avatar_url;

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
  new.student_avatar_url := student.avatar_url;
  new.cv_url := student.cv_url;
  new.cv_file_name := student.cv_file_name;
  new.applied_at := current_date;
  return new;
end;
$$;
revoke all on function public.prepare_application() from public, anon, authenticated;
