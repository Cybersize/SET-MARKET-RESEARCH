export interface Company {
  id: string;
  market: 'SET' | 'mai';
  industry: string;
  sector: string;
  symbol: string;
  symbol_name: string;
  description: string;
  report_download_link: string;
  company_website: string;
  updated_at: string;
  imported_at: string;
  logo?: string;
  isin_code?: string;
  ipo_date?: string;
  headquarters?: string;
  market_cap?: string;
  financial_as_of?: string;
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
}

export interface SyncProgress {
  phase: 'idle' | 'fetching' | 'saving' | 'done' | 'error';
  total: number;
  current: number;
  imported: number;
  updated: number;
  failed: string[];
  errors: string[];
  message: string;
}
