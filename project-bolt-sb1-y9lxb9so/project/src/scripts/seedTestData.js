import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Get the directory path of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
const envPath = join(__dirname, '../../.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=').map(part => part.trim().replace(/^["']|["']$/g, '')))
);

if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Create Supabase client with loaded environment variables
const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function getOrCreateEmployee(employeeData) {
  // Check if employee exists
  const { data: existing } = await supabase
    .from('employees')
    .select()
    .eq('email', employeeData.email)
    .single();

  if (existing) {
    console.log(`Employee ${employeeData.email} already exists`);
    return existing;
  }

  // Create new employee
  const { data, error } = await supabase
    .from('employees')
    .insert(employeeData)
    .select()
    .single();

  if (error) throw new Error(`Error creating employee: ${error.message}`);
  return data;
}

async function getOrCreateProject(projectData) {
  // Check if project exists
  const { data: existing } = await supabase
    .from('projects')
    .select()
    .eq('name', projectData.name)
    .single();

  if (existing) {
    console.log(`Project ${projectData.name} already exists`);
    return existing;
  }

  // Create new project
  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single();

  if (error) throw new Error(`Error creating project: ${error.message}`);
  return data;
}

async function seedTestData() {
  try {
    console.log('Starting to seed test data...');

    // First sign up a test user
    console.log('Creating test user...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (signUpError) {
      // If user already exists, try to sign in
      console.log('User might exist, trying to sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      });

      if (signInError) {
        throw new Error(`Error authenticating: ${signInError.message}`);
      }

      console.log('✅ Signed in successfully');
    } else {
      console.log('✅ Created and signed in new user');
    }

    // Add test employees
    console.log('Creating test employees...');
    const employee1 = await getOrCreateEmployee({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'developer',
      status: 'active'
    });
    console.log('✅ Employee 1 ready');

    const employee2 = await getOrCreateEmployee({
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'manager',
      status: 'active'
    });
    console.log('✅ Employee 2 ready');

    // Add test projects
    console.log('Creating test projects...');
    const project1 = await getOrCreateProject({
      name: 'Project Alpha',
      location: 'Amsterdam',
      start_date: '2024-01-01',
      status: 'active'
    });
    console.log('✅ Project 1 ready');

    const project2 = await getOrCreateProject({
      name: 'Project Beta',
      location: 'Rotterdam',
      start_date: '2024-01-15',
      status: 'active'
    });
    console.log('✅ Project 2 ready');

    if (employee1 && project1) {
      // Check for existing time entries
      const { data: existingEntries } = await supabase
        .from('time_entries')
        .select()
        .eq('employee_id', employee1.id)
        .eq('date', '2024-01-20');

      if (!existingEntries?.length) {
        // Add test time entries with 24-hour format
        console.log('Creating time entries...');
        const { error: error5 } = await supabase
          .from('time_entries')
          .insert([
            {
              date: '2024-01-20',
              start_time: '09:00',
              end_time: '17:00',
              break_duration: 30,
              project_id: project1.id,
              employee_id: employee1.id
            },
            {
              date: '2024-01-21',
              start_time: '08:30',
              end_time: '16:30',
              break_duration: 45,
              project_id: project1.id,
              employee_id: employee1.id
            }
          ]);

        if (error5) throw new Error(`Error creating time entries: ${error5.message}`);
        console.log('✅ Created time entries');
      } else {
        console.log('Time entries already exist');
      }

      // Check for existing costs
      const { data: existingCosts } = await supabase
        .from('costs')
        .select()
        .eq('project_id', project1.id)
        .eq('date', '2024-01-20');

      if (!existingCosts?.length) {
        // Add test costs
        console.log('Creating costs...');
        const { error: error6 } = await supabase
          .from('costs')
          .insert([
            {
              type: 'material',
              amount: 150.50,
              project_id: project1.id,
              date: '2024-01-20',
              category: 'material'
            },
            {
              type: 'transport',
              amount: 75.25,
              project_id: project1.id,
              date: '2024-01-21',
              category: 'transport'
            }
          ]);

        if (error6) throw new Error(`Error creating costs: ${error6.message}`);
        console.log('✅ Created costs');
      } else {
        console.log('Costs already exist');
      }

      // Check for existing kilometers
      const { data: existingKilometers } = await supabase
        .from('kilometers')
        .select()
        .eq('employee_id', employee1.id)
        .eq('date', '2024-01-20');

      if (!existingKilometers?.length) {
        // Add test kilometers
        console.log('Creating kilometers...');
        const { error: error7 } = await supabase
          .from('kilometers')
          .insert([
            {
              date: '2024-01-20',
              distance: 45.5,
              project_id: project1.id,
              employee_id: employee1.id,
              description: 'Client visit'
            },
            {
              date: '2024-01-21',
              distance: 32.8,
              project_id: project1.id,
              employee_id: employee1.id,
              description: 'Site inspection'
            }
          ]);

        if (error7) throw new Error(`Error creating kilometers: ${error7.message}`);
        console.log('✅ Created kilometers');
      } else {
        console.log('Kilometers already exist');
      }

      console.log('✅ All test data has been seeded successfully!');
      console.log('\nYou can now sign in with:');
      console.log('Email: test@example.com');
      console.log('Password: testpassword123');
    }
  } catch (error) {
    console.error('❌ Error seeding test data:', error.message);
    process.exit(1);
  }
}

// Execute the seeding
seedTestData();