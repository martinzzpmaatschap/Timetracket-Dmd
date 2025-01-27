import { supabase } from '../lib/supabase';

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('employees').select('count').single();
    
    if (error) {
      console.error('Database connection error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('Database connection successful');
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

// Helper function to check if all required tables exist
export const validateSchema = async () => {
  try {
    const tables = ['employees', 'projects', 'time_entries', 'costs'];
    const results = await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
          
        return { table, exists: !error, error };
      })
    );

    const missingTables = results.filter(r => !r.exists);
    
    if (missingTables.length > 0) {
      console.error('Missing tables:', missingTables.map(t => t.table).join(', '));
      return { success: false, missingTables };
    }

    return { success: true };
  } catch (err) {
    console.error('Schema validation error:', err);
    return { success: false, error: 'Schema validation failed' };
  }
};