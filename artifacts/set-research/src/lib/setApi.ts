import { Company } from '@/types';

// All SET API calls go through our server-side proxy at /api/set-proxy/*
// This keeps the API key secret and avoids CORS issues.
const PROXY_BASE = '/api/set-proxy';

export interface RawSymbol {
  symbol: string;
  securityNameEn: string;
  securityNameTh?: string;
  market: 'SET' | 'mai';
  industryNameEn: string;
  sectorNameEn: string;
}

export interface RawProfile {
  companyNameEn?: string;
  companyNameTh?: string;
  businessTypeEn?: string;
  businessTypeTh?: string;
  website?: string;
  url?: string;
}

export async function fetchSymbolList(): Promise<RawSymbol[]> {
  try {
    const res = await fetch(`${PROXY_BASE}/set/stock/list?lang=en`);
    if (!res.ok) throw new Error(`Symbol list fetch failed: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.securityList ?? data.result ?? []);
  } catch (error) {
    console.error('fetchSymbolList error:', error);
    return [];
  }
}

export async function fetchCompanyProfile(symbol: string): Promise<RawProfile | null> {
  try {
    const res = await fetch(`${PROXY_BASE}/set/stock/${symbol}/profile?lang=en`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`fetchCompanyProfile error for ${symbol}:`, error);
    return null;
  }
}

export async function fetchCompanyInfo(symbol: string): Promise<Partial<Company>> {
  const profile = await fetchCompanyProfile(symbol);
  if (!profile) return {};
  return {
    description: profile.businessTypeEn || profile.businessTypeTh || '',
    company_website: profile.website || profile.url || '',
    report_download_link: `https://www.set.or.th/en/market/product/stock/quote/${symbol}/financial-statement/company-highlights`,
  };
}
