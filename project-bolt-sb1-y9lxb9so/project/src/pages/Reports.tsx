import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { TimeEntry, Cost, Project } from '../types';

export default function Reports() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  // Fetch projects
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

  // Fetch time entries
  const { data: timeEntries } = useQuery({
    queryKey: ['timeEntries', selectedProject, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('time_entries')
        .select('*')
        .order('date', { ascending: false });

      if (selectedProject) {
        query = query.eq('project_id', selectedProject);
      }
      if (dateRange.start) {
        query = query.gte('date', dateRange.start);
      }
      if (dateRange.end) {
        query = query.lte('date', dateRange.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TimeEntry[];
    },
    enabled: Boolean(selectedProject) || Boolean(dateRange.start) || Boolean(dateRange.end),
  });

  // Fetch costs
  const { data: costs } = useQuery({
    queryKey: ['costs', selectedProject, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('costs')
        .select('*')
        .order('date', { ascending: false });

      if (selectedProject) {
        query = query.eq('project_id', selectedProject);
      }
      if (dateRange.start) {
        query = query.gte('date', dateRange.start);
      }
      if (dateRange.end) {
        query = query.lte('date', dateRange.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Cost[];
    },
    enabled: Boolean(selectedProject) || Boolean(dateRange.start) || Boolean(dateRange.end),
  });

  // Calculate totals
  const totalHours = timeEntries?.reduce((acc, entry) => {
    const start = new Date(`2000-01-01T${entry.start_time}`);
    const end = new Date(`2000-01-01T${entry.end_time}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return acc + hours - (entry.break_duration / 60);
  }, 0) || 0;

  const totalCosts = costs?.reduce((acc, cost) => acc + Number(cost.amount), 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Projects</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Time Entries</h2>
          <p className="text-3xl font-bold text-blue-600 mb-4">
            {totalHours.toFixed(2)} hours
          </p>
          <div className="space-y-4">
            {timeEntries?.map((entry) => (
              <div key={entry.id} className="border-b pb-2">
                <p className="font-medium">{entry.date}</p>
                <p className="text-sm text-gray-600">
                  {entry.start_time} - {entry.end_time}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Costs</h2>
          <p className="text-3xl font-bold text-green-600 mb-4">
            €{totalCosts.toFixed(2)}
          </p>
          <div className="space-y-4">
            {costs?.map((cost) => (
              <div key={cost.id} className="border-b pb-2">
                <p className="font-medium">{cost.date}</p>
                <p className="text-sm text-gray-600">
                  {cost.type}: €{cost.amount}
                </p>
                {cost.description && (
                  <p className="text-sm text-gray-500">{cost.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}