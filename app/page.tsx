'use client';

import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { supabase } from '@/lib/supabaseClient';
import { calculateSalary, calculateAguinaldo } from '@/lib/logic';
import {
  BarChart3,
  Clock,
  Users,
  DollarSign,
  Play,
  Square
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalHours: 0,
    projectedSalary: 0,
    aguinaldo: 0,
    employeeCount: 0
  });

  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const { data: emps, error: empError } = await supabase
        .from('employees')
        .select('*');

      if (empError) throw empError;
      setEmployees(emps || []);

      const activeEmployees = emps?.filter(e => e.status === 'ACTIVE') || [];

      // 2. Get Time Entries for this Month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: entries, error: timeError } = await supabase
        .from('time_entries')
        .select('*')
        .gte('created_at', startOfMonth.toISOString());

      if (timeError) throw timeError;

      // 3. Calculate Totals
      let totalHours = 0;
      let totalSalary = 0;

      entries?.forEach(entry => {
        if (entry.total_hours) {
          totalHours += Number(entry.total_hours);
          const emp = emps?.find(e => e.id === entry.employee_id);
          if (emp) {
            const salary = calculateSalary(Number(entry.total_hours), Number(emp.hourly_rate), false);
            totalSalary += salary;
          }
        }
      });

      const aguinaldo = calculateAguinaldo(totalSalary * 12);

      setStats({
        totalHours: Math.round(totalHours * 10) / 10,
        projectedSalary: Math.round(totalSalary),
        aguinaldo: Math.round(aguinaldo),
        employeeCount: activeEmployees.length
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedEmployeeId) {
      alert('Please select an employee first.');
      return;
    }

    try {
      setActionLoading(true);
      // Check if already checked in
      const { data: openEntry } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', selectedEmployeeId)
        .is('clock_out', null)
        .maybeSingle();

      if (openEntry) {
        alert('Employee is already checked in!');
        return;
      }

      const { error } = await supabase
        .from('time_entries')
        .insert([{
          employee_id: selectedEmployeeId,
          clock_in: new Date().toISOString()
        }]);

      if (error) throw error;
      alert('Checked In Successfully!');
      fetchStats();
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in');
    } finally {
      setActionLoading(false);
      setSelectedEmployeeId(''); // Reset selection
    }
  };

  const handleCheckOut = async () => {
    if (!selectedEmployeeId) {
      alert('Please select an employee first.');
      return;
    }

    try {
      setActionLoading(true);
      // Find open entry
      const { data: openEntry, error: fetchError } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', selectedEmployeeId)
        .is('clock_out', null)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!openEntry) {
        alert('Employee is NOT checked in.');
        return;
      }

      const { error } = await supabase
        .from('time_entries')
        .update({ clock_out: new Date().toISOString() })
        .eq('id', openEntry.id);

      if (error) throw error;
      alert('Checked Out Successfully!');
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error checking out:', error);
      alert('Failed to check out');
    } finally {
      setActionLoading(false);
      setSelectedEmployeeId('');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Hours (Month)"
          value={loading ? "..." : `${stats.totalHours}h`}
          icon="clock"
          color="blue"
          trend="+12%"
          trendDirection="up"
        />
        <StatCard
          label="Projected App Payroll"
          value={loading ? "..." : `$${stats.projectedSalary.toLocaleString()}`}
          icon="dollar"
          color="emerald"
          subValue="Monthly Estimate"
        />
        <StatCard
          label="Est. Aguinaldo Pool"
          value={loading ? "..." : `$${stats.aguinaldo.toLocaleString()}`}
          icon="calendar"
          color="amber"
          subValue="Yearly Provision"
        />
        <StatCard
          label="Active Employees"
          value={loading ? "..." : stats.employeeCount.toString()}
          icon="users"
          color="indigo"
          trend="+2"
          trendDirection="up"
        />
      </div>

      {/* Quick Actions / Time Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          Quick Time Tracking
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Log check-ins and check-outs for employees.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              <option value="">-- Select --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCheckIn}
              disabled={actionLoading || !selectedEmployeeId}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={20} fill="currentColor" />
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              disabled={actionLoading || !selectedEmployeeId}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Square size={20} fill="currentColor" />
              Check Out
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
