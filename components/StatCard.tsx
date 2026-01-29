import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, Briefcase, UserPlus, UserMinus, DollarSign, Clock, Calendar } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    subValue?: string;
    trend?: string;
    trendDirection?: 'up' | 'down';
    icon: 'users' | 'dollar' | 'clock' | 'calendar';
    color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    subValue,
    trend,
    trendDirection,
    icon,
    color = 'blue'
}) => {
    const IconMap = {
        users: Users,
        dollar: DollarSign,
        clock: Clock,
        calendar: Calendar
    };

    const Icon = IconMap[icon] || Users;

    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        indigo: 'bg-indigo-50 text-indigo-600',
    };

    const selectedColorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-full ${selectedColorClass}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendDirection === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {trendDirection === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend}
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{label}</h3>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
            </div>
        </div>
    );
};
