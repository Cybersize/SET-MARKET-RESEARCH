export interface Company {
  id: string;
  market: 'SET' | 'mai';
  sector: string;
  symbol: string;
  symbol_name: string;
  description: string;
  link_website: string;
  one_report_link: string;
  last_updated_at: string;
  imported_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: string;
  started_at: string;
  finished_at: string;
  total_imported: number;
  total_updated: number;
  success: boolean;
  failed_symbols: string[];
  error_logs: string[];
  source?: 'csv' | 'api';
  filename?: string;
}

export interface SyncProgress {
  phase: 'idle' | 'parsing' | 'saving' | 'done' | 'error';
  total: number;
  current: number;
  imported: number;
  updated: number;
  failed: string[];
  errors: string[];
  message: string;
}
