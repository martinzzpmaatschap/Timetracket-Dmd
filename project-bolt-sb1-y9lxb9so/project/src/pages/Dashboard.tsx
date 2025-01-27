import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { timeEntriesService } from '../services/timeEntries';

export default function Dashboard() {
  const { data: timeEntries, isLoading } = useQuery({
    queryKey: ['timeEntries'],
    queryFn: () => timeEntriesService.getAll()
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Time Entries */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Time Entries</h2>
          <div className="space-y-4">
            {timeEntries?.slice(0, 5).map((entry) => (
              <div key={entry.id} className="border-b pb-2">
                <p className="font-medium">{entry.date}</p>
                <p className="text-sm text-gray-600">
                  {entry.start_time} - {entry.end_time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Projects Overview</h2>
          <p className="text-gray-600">No active projects</p>
        </div>

        {/* Recent Costs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Costs</h2>
          <p className="text-gray-600">No recent costs</p>
        </div>
      </div>
    </div>
  );
}