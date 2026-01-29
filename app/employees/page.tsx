'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { EmployeeTable } from '@/components/EmployeeTable';
import { Employee } from '@/types';
import { Plus, X, Save } from 'lucide-react';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('employees')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEmployees(data || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (employee: Employee) => {
        setCurrentEmployee(employee);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this employee?')) return;

        try {
            const { error } = await supabase
                .from('employees')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee');
        }
    };

    const handleSave = async () => {
        try {
            if (!currentEmployee.full_name || !currentEmployee.hourly_rate) {
                alert('Name and Hourly Rate are required');
                return;
            }

            const payload = {
                full_name: currentEmployee.full_name,
                hourly_rate: currentEmployee.hourly_rate,
                job_title: currentEmployee.job_title,
                department: currentEmployee.department,
                status: currentEmployee.status || 'ACTIVE',
                avatar_url: currentEmployee.avatar_url
            };

            if (currentEmployee.id) {
                // Update
                const { error } = await supabase
                    .from('employees')
                    .update(payload)
                    .eq('id', currentEmployee.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('employees')
                    .insert([payload]);
                if (error) throw error;
            }

            setIsEditing(false);
            setCurrentEmployee({});
            fetchEmployees();
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Failed to save employee');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
                    <p className="text-gray-500">Manage your team members and rates.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentEmployee({});
                        setIsEditing(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Add Employee
                </button>
            </div>

            {/* Edit Form */}
            {isEditing && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900">{currentEmployee.id ? 'Edit Employee' : 'New Employee'}</h3>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={currentEmployee.full_name || ''}
                                onChange={e => setCurrentEmployee({ ...currentEmployee, full_name: e.target.value })}
                                placeholder="Ex. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={currentEmployee.hourly_rate || ''}
                                onChange={e => setCurrentEmployee({ ...currentEmployee, hourly_rate: parseFloat(e.target.value) })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={currentEmployee.job_title || ''}
                                onChange={e => setCurrentEmployee({ ...currentEmployee, job_title: e.target.value })}
                                placeholder="Ex. Chef"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={currentEmployee.department || ''}
                                onChange={e => setCurrentEmployee({ ...currentEmployee, department: e.target.value })}
                                placeholder="Ex. Kitchen"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={currentEmployee.status || 'ACTIVE'}
                                onChange={e => setCurrentEmployee({ ...currentEmployee, status: e.target.value as any })}
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="PROBATION">Probation</option>
                                <option value="ON_BOARDING">On Boarding</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Save size={18} />
                            Save Employee
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading employees...</div>
            ) : (
                <EmployeeTable
                    employees={employees}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
