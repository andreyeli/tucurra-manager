'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AppConfig } from '@/types';
import { Save, Settings } from 'lucide-react';

export default function ConfigPage() {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('app_config')
                .select('*')
                .single(); // Assuming single row for config

            if (error) throw error;
            setConfig(data);
        } catch (error) {
            console.error('Error fetching config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        try {
            setSaving(true);
            const { error } = await supabase
                .from('app_config')
                .update({
                    overtime_rate: config.overtime_rate,
                    vacation_percentage: config.vacation_percentage
                })
                .eq('id', config.id);

            if (error) throw error;
            alert('Configuration saved successfully');
        } catch (error) {
            console.error('Error saving config:', error);
            alert('Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="text-gray-400" />
                    Configuration
                </h2>
                <p className="text-gray-500">Global settings for salary and time calculations.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Overtime Rate Multiplier
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                value={config?.overtime_rate || 1.5}
                                onChange={e => setConfig(prev => prev ? ({ ...prev, overtime_rate: parseFloat(e.target.value) }) : null)}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">x</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Example: 1.5x means 50% extra for overtime hours.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vacation Percentage
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.0001"
                                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                value={config?.vacation_percentage || 0.0833}
                                onChange={e => setConfig(prev => prev ? ({ ...prev, vacation_percentage: parseFloat(e.target.value) }) : null)}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Default: 0.0833 (8.33%) represents roughly 1 month salary per year (Aguinaldo).</p>
                    </div>

                    <div className="pt-4 border-t border-gray-50">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-blue-200 shadow-md disabled:bg-blue-400"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
