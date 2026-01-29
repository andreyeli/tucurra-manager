export type EmployeeStatus = 'ACTIVE' | 'ON_BOARDING' | 'PROBATION';

export interface Employee {
    id: string;
    full_name: string;
    hourly_rate: number;
    start_date: string; // ISO date string
    job_title?: string;
    department?: string;
    status: EmployeeStatus;
    avatar_url?: string;
    created_at: string;
}

export interface AppConfig {
    id: string;
    overtime_rate: number;
    vacation_percentage: number;
}

export interface TimeEntry {
    id: string;
    employee_id: string;
    clock_in: string; // ISO timestamp
    clock_out?: string; // ISO timestamp
    total_hours?: number;
}

// For Dashboard Stats
export interface DashboardStats {
    totalHoursMonth: number;
    projectedPayroll: number; // Planilla
    totalAguinaldos: number;
}
