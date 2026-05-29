-- ============================================================
--  FIELD EXPERIENCE — SUPABASE SCHEMA
--  Run this entire file in Supabase SQL Editor (one shot)
-- ============================================================

-- ── EXTENSIONS ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ── TEACHERS (access whitelist) ─────────────────────────────
create table if not exists teachers (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  name       text,
  created_at timestamptz default now()
);

-- Seed teacher accounts
insert into teachers (email, name) values
  ('michael.theriault@bps101.net', 'Michael Theriault'),
  ('austun.savitski@bps101.net',   'Austun Savitski'),
  ('mjtheriault01@gmail.com',      'Michael Theriault (personal)')
on conflict (email) do nothing;


-- ── STUDENTS ────────────────────────────────────────────────
-- Linked to Supabase auth.users — row auto-created on first login via trigger below
create table if not exists students (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text unique not null,
  first_name          text,
  last_name           text,
  period              text,
  cluster_id          text,
  placement_employer  text,
  placement_address   text,
  placement_confirmed boolean default false,
  hours_goal          integer default 60,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- Auto-create student row on first Google sign-in
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into students (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'given_name',  split_part(new.email, '.', 1)),
    coalesce(new.raw_user_meta_data->>'family_name', split_part(split_part(new.email, '.', 2), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ── BOOTCAMP PROGRESS ───────────────────────────────────────
create table if not exists bootcamp_progress (
  id           uuid primary key default uuid_generate_v4(),
  student_id   uuid not null references students(id) on delete cascade,
  phase        integer not null check (phase between 1 and 4),
  task_id      text not null,   -- e.g. 'p1_career_reflection'
  task_label   text,
  completed_at timestamptz default now(),
  unique(student_id, task_id)
);


-- ── RESUME DATA ─────────────────────────────────────────────
create table if not exists resume_data (
  id              uuid primary key default uuid_generate_v4(),
  student_id      uuid unique not null references students(id) on delete cascade,
  contact         jsonb default '{}',        -- {name, email, phone, city, linkedin}
  objective       text,
  work_experience jsonb default '[]',        -- [{employer, role, start, end, tasks[]}]
  education       jsonb default '[]',        -- [{school, grad_year, gpa, courses[]}]
  activities      jsonb default '[]',        -- [{name, role, years, description}]
  skills          jsonb default '[]',        -- ["Adobe Suite", "Customer Service", ...]
  resume_refs     jsonb default '[]',        -- [{name, title, org, email, phone}]
  updated_at      timestamptz default now()
);


-- ── ELEVATOR PITCHES ────────────────────────────────────────
create table if not exists elevator_pitches (
  id               uuid primary key default uuid_generate_v4(),
  student_id       uuid not null references students(id) on delete cascade,
  attempt_number   integer default 1,
  script_text      text,
  video_path       text,   -- Supabase Storage path: elevator-pitches/{student_id}/{attempt}.webm
  video_url        text,   -- public URL after upload
  peer_feedback    jsonb default '[]',  -- [{reviewer_id, reviewer_name, comment, submitted_at}]
  teacher_feedback text,
  submitted_at     timestamptz default now()
);


-- ── WEEKLY LOGS ─────────────────────────────────────────────
-- One row per student per week.
-- Projected section filled Sunday BEFORE the week.
-- Actual section filled Sunday AFTER the week.
create table if not exists weekly_logs (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references students(id) on delete cascade,
  week_start  date not null,  -- always the Monday of that week

  -- Per-day: location (specific site), supervisor, expected hours, actual hours
  mon_location   text, mon_supervisor text, mon_expected numeric(4,2), mon_actual numeric(4,2),
  tue_location   text, tue_supervisor text, tue_expected numeric(4,2), tue_actual numeric(4,2),
  wed_location   text, wed_supervisor text, wed_expected numeric(4,2), wed_actual numeric(4,2),
  thu_location   text, thu_supervisor text, thu_expected numeric(4,2), thu_actual numeric(4,2),
  fri_location   text, fri_supervisor text, fri_expected numeric(4,2), fri_actual numeric(4,2),
  sat_location   text, sat_supervisor text, sat_expected numeric(4,2), sat_actual numeric(4,2),
  sun_location   text, sun_supervisor text, sun_expected numeric(4,2), sun_actual numeric(4,2),

  total_expected      numeric(5,2) default 0,
  total_actual        numeric(5,2) default 0,
  cumulative_actual   numeric(6,2) default 0,  -- running total toward 60 hrs (computed on save)
  key_tasks           text,

  projected_submitted_at  timestamptz,  -- set when student submits the "before" section
  actual_submitted_at     timestamptz,  -- set when student submits the "after" section
  updated_at              timestamptz default now(),

  unique(student_id, week_start)
);


-- ── WEEKLY REFLECTIONS ──────────────────────────────────────
-- Mirrors the existing Google Form — replaces it entirely
create table if not exists weekly_reflections (
  id                   uuid primary key default uuid_generate_v4(),
  student_id           uuid not null references students(id) on delete cascade,
  week_start           date not null,
  what_worked_on       text,
  key_learning         text,
  highlight            text,
  challenges           text,
  impact               text,
  improvement_area     text,
  employability_skill  text,
  skill_demonstration  text,
  teacher_note         text,
  submitted_at         timestamptz default now(),
  unique(student_id, week_start)
);


-- ── PORTFOLIO ITEMS ─────────────────────────────────────────
create table if not exists portfolio_items (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references students(id) on delete cascade,
  type        text not null check (type in ('photo','document','link','video','reflection','other')),
  title       text not null,
  description text,
  file_path   text,   -- Supabase Storage path
  file_url    text,   -- public or signed URL
  source_ref  text,   -- e.g. 'weekly_reflection:uuid' for auto-linked items
  created_at  timestamptz default now()
);


-- ── INTERVIEW LOG ───────────────────────────────────────────
create table if not exists interview_log (
  id             uuid primary key default uuid_generate_v4(),
  student_id     uuid not null references students(id) on delete cascade,
  employer       text not null,
  interview_type text check (interview_type in ('mock','real')),
  interview_date date,
  status         text default 'scheduled'
                   check (status in ('scheduled','completed','offered','accepted','declined','no_offer')),
  student_notes  text,
  feedback       text,   -- from community partner / teacher
  created_at     timestamptz default now()
);


-- ── INDEXES ─────────────────────────────────────────────────
create index if not exists idx_bootcamp_student    on bootcamp_progress(student_id, phase);
create index if not exists idx_logs_student_week   on weekly_logs(student_id, week_start desc);
create index if not exists idx_reflect_student     on weekly_reflections(student_id, week_start desc);
create index if not exists idx_portfolio_student   on portfolio_items(student_id, created_at desc);
create index if not exists idx_interview_student   on interview_log(student_id);


-- ── HELPER: is current user a teacher? ──────────────────────
create or replace function is_teacher()
returns boolean
language sql security definer stable as $$
  select exists (
    select 1 from teachers
    where email = (auth.jwt() ->> 'email')
  );
$$;


-- ── ROW LEVEL SECURITY ──────────────────────────────────────
alter table teachers           enable row level security;
alter table students           enable row level security;
alter table bootcamp_progress  enable row level security;
alter table resume_data        enable row level security;
alter table elevator_pitches   enable row level security;
alter table weekly_logs        enable row level security;
alter table weekly_reflections enable row level security;
alter table portfolio_items    enable row level security;
alter table interview_log      enable row level security;

-- Teachers table: any logged-in user can read (needed for role check in JS)
create policy "teachers_readable" on teachers
  for select to authenticated using (true);

-- Students: see/edit own row; teachers see all
create policy "students_self" on students
  for all to authenticated
  using  (id = auth.uid() or is_teacher())
  with check (id = auth.uid() or is_teacher());

-- Bootcamp progress: own data; teachers read all
create policy "bootcamp_self" on bootcamp_progress
  for all to authenticated
  using  (student_id = auth.uid() or is_teacher())
  with check (student_id = auth.uid());

-- Resume: own data; teachers read all
create policy "resume_self" on resume_data
  for all to authenticated
  using  (student_id = auth.uid() or is_teacher())
  with check (student_id = auth.uid());

-- Elevator pitches: own data; teachers read all; peers can insert feedback via update
create policy "pitches_self" on elevator_pitches
  for all to authenticated
  using  (student_id = auth.uid() or is_teacher())
  with check (student_id = auth.uid());

-- Weekly logs: own data; teachers read all
create policy "logs_self" on weekly_logs
  for all to authenticated
  using  (student_id = auth.uid() or is_teacher())
  with check (student_id = auth.uid());

-- Weekly reflections: own data; teachers read all
create policy "reflections_self" on weekly_reflections
  for all to authenticated
  using  (student_id = auth.uid() or is_teacher())
  with check (student_id = auth.uid());

-- Portfolio: own data; teachers read all
create policy "portfolio_self" on portfolio_items
  for all to authenticated
  using  (student_id = auth.uid() or is_teacher())
  with check (student_id = auth.uid());

-- Interview log: students read/insert own; teachers read+write all
create policy "interviews_read" on interview_log
  for select to authenticated
  using (student_id = auth.uid() or is_teacher());
create policy "interviews_insert" on interview_log
  for insert to authenticated
  with check (student_id = auth.uid());
create policy "interviews_teacher_update" on interview_log
  for update to authenticated
  using (is_teacher());


-- ── STORAGE BUCKETS ─────────────────────────────────────────
-- Run these lines separately if the buckets don't exist yet.
-- Go to: Supabase Dashboard → Storage → New bucket
--
--   Bucket name: elevator-pitches   (private)
--   Bucket name: portfolio           (private)
--
-- Or uncomment and run:
-- insert into storage.buckets (id, name, public) values ('elevator-pitches', 'elevator-pitches', false) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', false) on conflict do nothing;
