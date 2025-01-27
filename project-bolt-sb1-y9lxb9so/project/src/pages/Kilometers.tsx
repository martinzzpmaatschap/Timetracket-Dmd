import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { kilometersService } from '../services/kilometers';
import { supabase } from '../lib/supabase';
import type { Kilometer, Project, Employee } from '../types';

type KilometerFormData = Omit<Kilometer, 'id' | 'created_at' | 'updated_at'>;

export default function Kilometers() {
  const { register, handleSubmit, reset } = useForm<KilometerFormData>();
  const queryClient = useQueryClient();

  // Fetch projects for the dropdown
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Project[];
    }
  });

  // Fetch employees for the dropdown
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Employee[];
    }
  });

  // Fetch kilometers
  const { data: kilometers } = useQuery({
    queryKey: ['kilometers'],
    queryFn: () => kilometersService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (data: KilometerFormData) => kilometersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kilometers'] });
      reset();
    },
  });

  const onSubmit = (data: KilometerFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kilometer Registration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  {...register('date')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('distance')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <select
                  {...register('project_id')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a project</option>
                  {projects?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <select
                  {...register('employee_id')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select an employee</option>
                  {employees?.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Kilometers'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
          <div className="space-y-4">
            {kilometers?.map((entry) => (
              <div key={entry.id} className="border-b pb-2">
                <p className="font-medium">{entry.date}</p>
                <p className="text-sm text-gray-600">
                  {entry.distance} km - {entry.projects.name}
                </p>
                {entry.description && (
                  <p className="text-sm text-gray-500">{entry.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}