import { supabase } from '../lib/supabase';

async function seedTestData() {
  // Add test employees
  const { data: employee1 } = await supabase
    .from('employees')
    .insert({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'developer'
    })
    .select()
    .single();

  const { data: employee2 } = await supabase
    .from('employees')
    .insert({
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'manager'
    })
    .select()
    .single();

  // Add test projects
  const { data: project1 } = await supabase
    .from('projects')
    .insert({
      name: 'Project Alpha',
      location: 'Amsterdam',
      start_date: '2024-01-01'
    })
    .select()
    .single();

  const { data: project2 } = await supabase
    .from('projects')
    .insert({
      name: 'Project Beta',
      location: 'Rotterdam',
      start_date: '2024-01-15'
    })
    .select()
    .single();

  if (employee1 && project1) {
    // Add test time entries
    await supabase
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

    // Add test costs
    await supabase
      .from('costs')
      .insert([
        {
          type: 'material',
          amount: 150.50,
          project_id: project1.id,
          date: '2024-01-20'
        },
        {
          type: 'transport',
          amount: 75.25,
          project_id: project1.id,
          date: '2024-01-21'
        }
      ]);

    // Add test kilometers
    await supabase
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
  }

  console.log('Test data has been seeded successfully!');
}

// Execute the seeding
seedTestData().catch(console.error);