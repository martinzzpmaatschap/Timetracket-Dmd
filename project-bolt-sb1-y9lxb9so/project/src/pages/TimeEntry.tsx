import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { timeEntriesService } from '../services/timeEntries';
import { supabase } from '../lib/supabase';
import type { TimeEntry, Project, Employee } from '../types';

type TimeEntryFormData = Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>;

// Ensure time is in 24-hour format
const formatTime = (time: string): string => {
  if (!time) return '';
  // Force 24-hour format by ensuring two digits for hours
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes}`;
};

export default function TimeEntryPage() {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TimeEntryFormData>({
    defaultValues: {
      break_duration: 0,
      date: new Date().toISOString().split('T')[0]
    }
  });
  
  const queryClient = useQueryClient();
  const startTime = watch('start_time');
  const endTime = watch('end_time');

  // Calculate total hours (including break)
  const calculateTotalHours = () => {
    if (!startTime || !endTime) return null;
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (totalMinutes <= 0) totalMinutes += 24 * 60; // Handle overnight shifts
    
    return (totalMinutes / 60).toFixed(2);
  };

  // Improved time validation with strict 24-hour format
  const validateTime = (time: string): boolean => {
    if (!time) return false;
    // Strict 24-hour format validation (00:00 to 23:59)
    const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(formatTime(time));
  };

  // Validate end time is after start time
  const validateEndTime = (endTime: string): boolean | string => {
    if (!validateTime(endTime)) return 'Please enter a valid time in 24-hour format (HH:mm)';
    if (!startTime) return true;
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startMinutesTotal = startHours * 60 + startMinutes;
    const endMinutesTotal = endHours * 60 + endMinutes;
    
    // Allow overnight shifts but validate total duration
    let totalMinutes = endMinutesTotal - startMinutesTotal;
    if (totalMinutes <= 0) totalMinutes += 24 * 60;
    
    if (totalMinutes > 16 * 60) {
      return 'Shift duration cannot exceed 16 hours';
    }
    
    return true;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start_time' | 'end_time') => {
    const value = e.target.value;
    if (validateTime(value)) {
      setValue(field, formatTime(value));
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: TimeEntryFormData) => {
      const formattedData = {
        ...data,
        break_duration: Number(data.break_duration) || 0
      };
      
      // Calculate total hours for validation
      const totalHours = calculateTotalHours();
      if (totalHours && parseFloat(totalHours) > 16) {
        throw new Error('Shift duration cannot exceed 16 hours');
      }
      
      return timeEntriesService.create(formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      reset({
        date: new Date().toISOString().split('T')[0], // Keep today's date
        break_duration: 0 // Reset to default break duration
      });
    },
  });

  // Fetch projects for the dropdown
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active') // Only show active projects
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
        .eq('status', 'active') // Only show active employees
        .order('name');
      if (error) throw error;
      return data as Employee[];
    }
  });

  const onSubmit = (data: TimeEntryFormData) => {
    createMutation.mutate(data);
  };

  // Calculate total hours for display
  const totalHours = calculateTotalHours();
  const breakDuration = watch('break_duration') || 0;
  const netHours = totalHours ? (parseFloat(totalHours) - (breakDuration / 60)).toFixed(2) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Time Entry</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time (24-hour format, HH:mm)</label>
            <input
              type="time"
              {...register('start_time', { 
                required: 'Start time is required',
                validate: validateTime
              })}
              onChange={(e) => handleTimeChange(e, 'start_time')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.start_time && (
              <p className="mt-1 text-sm text-red-600">
                {errors.start_time.message || 'Please enter a valid time in 24-hour format (HH:mm)'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Time (24-hour format, HH:mm)</label>
            <input
              type="time"
              {...register('end_time', { 
                required: 'End time is required',
                validate: validateEndTime
              })}
              onChange={(e) => handleTimeChange(e, 'end_time')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.end_time && (
              <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
            )}
          </div>

          {totalHours && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">Total Hours: {totalHours}</p>
              <p className="text-sm text-gray-600">Break Duration: {breakDuration} minutes</p>
              <p className="text-sm font-medium text-gray-700">Net Hours: {netHours}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Break Duration (minutes)</label>
            <input
              type="number"
              min="0"
              step="5"
              {...register('break_duration', {
                valueAsNumber: true,
                min: { value: 0, message: 'Break duration cannot be negative' },
                max: { value: 120, message: 'Break duration cannot exceed 120 minutes' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.break_duration && (
              <p className="mt-1 text-sm text-red-600">{errors.break_duration.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <select
              {...register('project_id', { required: 'Project is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a project</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project_id && (
              <p className="mt-1 text-sm text-red-600">{errors.project_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              {...register('employee_id', { required: 'Employee is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select an employee</option>
              {employees?.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            {errors.employee_id && (
              <p className="mt-1 text-sm text-red-600">{errors.employee_id.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Saving...' : 'Save Time Entry'}
          </button>

          {createMutation.isError && (
            <div className="mt-2 text-sm text-red-600">
              {createMutation.error instanceof Error ? createMutation.error.message : 'An error occurred while saving the time entry. Please try again.'}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}