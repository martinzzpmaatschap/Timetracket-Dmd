import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import TimeEntry from './pages/TimeEntry';
import CostEntry from './pages/CostEntry';
import Reports from './pages/Reports';
import Auth from './pages/Auth';
import Kilometers from './pages/Kilometers';
import ProjectManagement from './pages/ProjectManagement';
import EmployeeManagement from './pages/EmployeeManagement';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold text-gray-800">TimeTracker</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      to="/"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/time-entry"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Time Entry
                    </Link>
                    <Link
                      to="/cost-entry"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Cost Entry
                    </Link>
                    <Link
                      to="/kilometers"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Kilometers
                    </Link>
                    <Link
                      to="/reports"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Reports
                    </Link>
                    <Link
                      to="/projects"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Projects
                    </Link>
                    <Link
                      to="/employees"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Employees
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <Link
                    to="/auth"
                    className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <div className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/time-entry"
                  className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  Time Entry
                </Link>
                <Link
                  to="/cost-entry"
                  className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  Cost Entry
                </Link>
                <Link
                  to="/kilometers"
                  className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  Kilometers
                </Link>
                <Link
                  to="/reports"
                  className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  Reports
                </Link>
                <Link
                  to="/projects"
                  className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  Projects
                </Link>
                <Link
                  to="/employees"
                  className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  Employees
                </Link>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/time-entry" element={<TimeEntry />} />
              <Route path="/cost-entry" element={<CostEntry />} />
              <Route path="/kilometers" element={<Kilometers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/projects" element={<ProjectManagement />} />
              <Route path="/employees" element={<EmployeeManagement />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}