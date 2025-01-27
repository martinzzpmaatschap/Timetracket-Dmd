import { supabase } from '../lib/supabase';
import type { Kilometer } from '../types';

export const kilometersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('kilometers')
      .select('*, projects(name), employees(name)')
      .order('date', { ascending: false });

    if (error) throw error;
    return data as (Kilometer & { projects: { name: string }, employees: { name: string } })[];
  },

  async create(kilometer: Omit<Kilometer, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('kilometers')
      .insert(kilometer)
      .select()
      .single();

    if (error) throw error;
    return data as Kilometer;
  },

  async update(id: string, kilometer: Partial<Kilometer>) {
    const { data, error } = await supabase
      .from('kilometers')
      .update(kilometer)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Kilometer;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('kilometers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};