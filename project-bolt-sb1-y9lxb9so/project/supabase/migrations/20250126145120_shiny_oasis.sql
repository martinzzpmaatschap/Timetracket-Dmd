/*
  # Add kilometers table for mileage tracking

  1. New Tables
    - `kilometers`
      - `id` (uuid, primary key)
      - `date` (date)
      - `distance` (decimal)
      - `project_id` (uuid, foreign key)
      - `employee_id` (uuid, foreign key)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `kilometers` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS kilometers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  distance decimal(10,2) NOT NULL CHECK (distance > 0),
  project_id uuid NOT NULL REFERENCES projects(id),
  employee_id uuid NOT NULL REFERENCES employees(id),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE kilometers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kilometers are viewable by authenticated users"
  ON kilometers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kilometers are insertable by authenticated users"
  ON kilometers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Kilometers are updatable by authenticated users"
  ON kilometers
  FOR UPDATE
  TO authenticated
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_kilometers_updated_at
  BEFORE UPDATE ON kilometers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();