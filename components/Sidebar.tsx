'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid,
    Users,
    Clock,
    Settings,
    LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/', icon: LayoutGrid },
        { name: 'Empleados', href: '/employees', icon: Users },
        { name: 'Control de Horas', href: '/time', icon: Clock },
        { name: 'Configuración', href: '/config', icon: Settings },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
            {/* Logo */}
            <div className="p-8 pb-4">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">O</span>
                    Optime
                </h1>
            </div>

            {/* Nav */}
            <div className="px-4 py-2 flex-1">
                <p className="px-4 text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Menú</p>
                <ul className="space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <link.icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* User / Bottom Section */}
            <div className="mt-auto p-4 border-t border-gray-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            A
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 truncate">Admin</p>
                            <p className="text-xs text-gray-400">Gerente</p>
                        </div>
                    </div>
                    <button
                        onClick={async () => {
                            const { supabase } = await import('@/lib/supabaseClient');
                            await supabase.auth.signOut();
                            window.location.reload();
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
