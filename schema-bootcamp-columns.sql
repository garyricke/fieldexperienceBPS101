-- Add columns needed for bootcamp phase tracking and Launch Card
-- Run in Supabase SQL Editor → New query

alter table bootcamp_progress add column if not exists notes text;
alter table students add column if not exists semester_goal  text;
alter table students add column if not exists launch_date    timestamptz;
alter table students add column if not exists placement_name text;
