'use client';

import React from 'react';
import { Employee } from '@/types';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface EmployeeTableProps {
    employees: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">All Employees</h3>
                {/* Buttons (Export, etc) could go here */}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Employee Name</th>
                            <th className="px-6 py-4">Job Title</th>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Rate ($/hr)</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                    No employees found. Add one to get started.
                                </td>
                            </tr>
                        ) : employees.map((employee) => (
                            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* Accessing avatar_url directly or placeholder */}
                                        <img
                                            src={employee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.full_name)}&background=random`}
                                            alt={employee.full_name}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{employee.full_name}</p>
                                            {/* <p className="text-xs text-gray-400">email@example.com</p> */}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-900">{employee.job_title || 'N/A'}</td>
                                <td className="px-6 py-4">{employee.department || 'General'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${employee.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' :
                                            employee.status === 'PROBATION' ? 'bg-indigo-50 text-indigo-600' :
                                                'bg-amber-50 text-amber-600'
                                        }`}>
                                        {employee.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono font-medium text-gray-900">
                                    ${employee.hourly_rate}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(employee)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(employee.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
