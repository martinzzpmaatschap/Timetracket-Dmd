/*
  # Initial schema setup

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `time_entries`
      - `id` (uuid, primary key)
      - `date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `break_duration` (integer)
      - `project_id` (uuid, foreign key)
      - `employee_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `costs`
      - `id` (uuid, primary key)
      - `type` (text)
      - `amount` (decimal)
      - `project_id` (uuid, foreign key)
      - `date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees are viewable by authenticated users"
  ON employees
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employees are insertable by authenticated users"
  ON employees
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Employees are updatable by authenticated users"
  ON employees
  FOR UPDATE
  TO authenticated
  USING (true);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  location text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by authenticated users"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Projects are insertable by authenticated users"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Projects are updatable by authenticated users"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true);

-- Time entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  break_duration integer NOT NULL DEFAULT 0,
  project_id uuid NOT NULL REFERENCES projects(id),
  employee_id uuid NOT NULL REFERENCES employees(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT time_entries_end_time_check CHECK (end_time > start_time)
);

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Time entries are viewable by authenticated users"
  ON time_entries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Time entries are insertable by authenticated users"
  ON time_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Time entries are updatable by authenticated users"
  ON time_entries
  FOR UPDATE
  TO authenticated
  USING (true);

-- Costs table
CREATE TABLE IF NOT EXISTS costs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL,
  amount decimal(10,2) NOT NULL,
  project_id uuid NOT NULL REFERENCES projects(id),
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Costs are viewable by authenticated users"
  ON costs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Costs are insertable by authenticated users"
  ON costs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Costs are updatable by authenticated users"
  ON costs
  FOR UPDATE
  TO authenticated
  USING (true);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_costs_updated_at
  BEFORE UPDATE ON costs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();