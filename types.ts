
export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum Shift {
  SHIFT_1 = 'Shift 1',
  SHIFT_2 = 'Shift 2',
  SHIFT_3 = 'Shift 3'
}

export interface HourlyData {
  hour: number;
  count: number;
}

export interface BreakdownInfo {
  durationMinutes: number;
  reason: string;
}

export interface ProductionRecord {
  id: string;
  machineId: number;
  machineType: string;
  date: string;
  startTime: string;
  shift: Shift;
  hourlyProduction: HourlyData[];
  breakdown: BreakdownInfo;
  isSynced: boolean;
  createdAt: number;
}
