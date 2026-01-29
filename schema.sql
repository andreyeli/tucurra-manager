-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Config Table (Global Settings)
create table app_config (
  id uuid primary key default uuid_generate_v4(),
  overtime_rate numeric not null default 1.5,
  vacation_percentage numeric not null default 0.0833, -- 8.33% (~1 month per year)
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default config if not exists
insert into app_config (id, overtime_rate, vacation_percentage)
select uuid_generate_v4(), 1.5, 0.0833
where not exists (select 1 from app_config);

-- 2. Employees Table
create table employees (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  hourly_rate numeric not null,
  start_date date not null default current_date,
  job_title text,
  department text,
  status text default 'ACTIVE', -- ACTIVE, ON_BOARDING, PROBATION
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Time Entries (for Check-in/Check-out)
create table time_entries (
  id uuid primary key default uuid_generate_v4(),
  employee_id uuid references employees(id) on delete cascade not null,
  clock_in timestamp with time zone not null,
  clock_out timestamp with time zone,
  total_hours numeric generated always as (
    extract(epoch from (clock_out - clock_in)) / 3600
  ) stored,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies (Simple for now: Authenticated users/Admins can do everything)
alter table app_config enable row level security;
alter table employees enable row level security;
alter table time_entries enable row level security;

create policy "Enable all access for authenticated users" on app_config for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on employees for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on time_entries for all using (auth.role() = 'authenticated');
