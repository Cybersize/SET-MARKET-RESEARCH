import { Company } from '@/types';

// Company list comes from our server-side static seed list
const COMPANIES_URL = '/api/set/companies';

// Financial data comes through the SET Marketplace proxy (api-key injected server-side)
const PROXY_BASE = '/api/set-proxy';

export interface StaticCompany {
  symbol: string;
  nameEn: string;
  market: 'SET' | 'mai';
  industry: string;
  sector: string;
}

export interface FinancialRecord {
  symbol: string;
  fiscalYear: number;
  quarter: number;
  statementType: string;
  asOfDate: string;
  currency: string;
  financialStatementDetail: { accountCode: string; amount: number; accumulatedAmount: number }[];
}

export async function fetchSymbolList(): Promise<StaticCompany[]> {
  try {
    const res = await fetch(COMPANIES_URL);
    if (!res.ok) throw new Error(`Company list fetch failed: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('fetchSymbolList error:', error);
    return [];
  }
}

export async function fetchFinancialStatement(symbol: string): Promise<FinancialRecord[]> {
  try {
    const res = await fetch(`${PROXY_BASE}/financial-statement/company?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Build a Company object from the static data + latest financial record
export function buildCompany(
  raw: StaticCompany,
  financials: FinancialRecord[]
): Company {
  const latest = financials.length > 0
    ? financials.reduce((a, b) => (a.asOfDate > b.asOfDate ? a : b))
    : null;

  return {
    id: raw.symbol,
    symbol: raw.symbol,
    symbol_name: raw.nameEn,
    market: raw.market,
    sector: raw.sector,
    description: latest ? `Financial data as of ${latest.asOfDate} (${latest.currency})` : '',
    link_website: `https://www.set.or.th/en/market/product/stock/quote/${raw.symbol}/overview`,
    one_report_link: `https://www.set.or.th/en/market/product/stock/quote/${raw.symbol}/financial-statement/company-highlights`,
    last_updated_at: latest?.asOfDate ?? '',
    updated_at: new Date().toISOString(),
    imported_at: new Date().toISOString(),
  };
}
