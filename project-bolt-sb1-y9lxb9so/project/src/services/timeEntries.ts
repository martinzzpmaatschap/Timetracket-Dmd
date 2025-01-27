import { supabase } from '../lib/supabase';
import type { TimeEntry } from '../types';

export const timeEntriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data as TimeEntry[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as TimeEntry;
  },

  async create(timeEntry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('time_entries')
      .insert(timeEntry)
      .select()
      .single();

    if (error) throw error;
    return data as TimeEntry;
  },

  async update(id: string, timeEntry: Partial<TimeEntry>) {
    const { data, error } = await supabase
      .from('time_entries')
      .update(timeEntry)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as TimeEntry;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};