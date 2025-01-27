/*
  # Schema improvements for better functionality

  1. Changes to employees table
    - Add status column for employee activation state
    - Add email validation constraint
    - Add name length constraint

  2. Changes to projects table  
    - Add status column for project state tracking
    - Add budget column for financial planning
    - Add description column
    - Add name/location length constraints

  3. Changes to time_entries table
    - Add overtime_hours column
    - Add notes column for context

  4. Changes to costs table
    - Add description column
    - Add category column for better analysis
*/

-- Employee improvements
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'status'
  ) THEN
    ALTER TABLE employees ADD COLUMN status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
    ALTER TABLE employees ADD CONSTRAINT employees_name_length CHECK (char_length(name) BETWEEN 2 AND 100);
    ALTER TABLE employees ADD CONSTRAINT employees_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

-- Project improvements
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'status'
  ) THEN
    ALTER TABLE projects ADD COLUMN status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled'));
    ALTER TABLE projects ADD COLUMN budget decimal(12,2);
    ALTER TABLE projects ADD COLUMN description text;
    ALTER TABLE projects ADD CONSTRAINT projects_name_length CHECK (char_length(name) BETWEEN 2 AND 100);
    ALTER TABLE projects ADD CONSTRAINT projects_location_length CHECK (char_length(location) BETWEEN 2 AND 200);
  END IF;
END $$;

-- Time entries improvements
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'time_entries' AND column_name = 'overtime_hours'
  ) THEN
    ALTER TABLE time_entries ADD COLUMN overtime_hours decimal(4,2) DEFAULT 0;
    ALTER TABLE time_entries ADD COLUMN notes text;
  END IF;
END $$;

-- Costs improvements
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'costs' AND column_name = 'description'
  ) THEN
    ALTER TABLE costs ADD COLUMN description text;
    ALTER TABLE costs ADD COLUMN category text NOT NULL DEFAULT 'other' CHECK (category IN ('material', 'transport', 'equipment', 'labor', 'other'));
  END IF;
END $$;