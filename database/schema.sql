-- database/schema.sql
-- Nova Payroll System – Database Schema

-- Company table
CREATE TABLE IF NOT EXISTS public.Company (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Employee table
CREATE TABLE IF NOT EXISTS public.Employee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_email TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  type TEXT NOT NULL,
  employee_company UUID REFERENCES public.Company(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);