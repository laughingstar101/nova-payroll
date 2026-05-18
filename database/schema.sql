-- database/schema.sql
-- Nova Payroll System – Database Schema

-- Company table
create table if not exists public."Company" (
  id uuid not null default gen_random_uuid (),
  company_email text not null,
  company_name text not null,
  company_id uuid not null,
  created_at timestamp with time zone null default now(),
  constraint Company_pkey primary key (id),
  constraint Company_company_id_fkey foreign KEY (company_id) references auth.users (id)
);

-- Employee table
create table if not exists public."Employee" (
  id uuid not null default gen_random_uuid (),
  employee_email text not null,
  employee_name text not null,
  type text not null,
  employee_company uuid null,
  created_at timestamp with time zone null default now(),
  constraint Employee_pkey primary key (id),
  constraint Employee_employee_company_fkey foreign KEY (employee_company) references "Company" (id)
);