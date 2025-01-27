export interface TimeEntry {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  project_id: string;
  employee_id: string;
  created_at: string;
  updated_at: string;
}

export interface Cost {
  id: string;
  type: string;
  amount: number;
  project_id: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Kilometer {
  id: string;
  date: string;
  distance: number;
  project_id: string;
  employee_id: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}