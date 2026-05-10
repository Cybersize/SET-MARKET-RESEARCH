import { Company } from '@/types';

// The actual SET API returns these fields, we do our best effort mapping.
// Note: You may run into CORS issues if calling directly from browser.
// Ideally this should go through a proxy or backend.

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

const BASE_URL = 'https://www.set.or.th/api/set';

export async function fetchSymbolList(): Promise<RawSymbol[]> {
  try {
    const res = await fetch(`${BASE_URL}/stock/list?lang=en`);
    if (!res.ok) throw new Error('Failed to fetch symbol list');
    const data = await res.json();
    // In actual SET API, data.securityList or similar might hold the array.
    // We assume data is the array or has a standard structure.
    return Array.isArray(data) ? data : (data.securityList || []);
  } catch (error) {
    console.error('fetchSymbolList error:', error);
    return [];
  }
}

export async function fetchCompanyProfile(symbol: string): Promise<RawProfile | null> {
  try {
    const res = await fetch(`${BASE_URL}/stock/${symbol}/profile?lang=en`);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
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
    // Just a placeholder, actual report download link logic would depend on other API endpoints
    report_download_link: `https://www.set.or.th/en/market/product/stock/quote/${symbol}/financial-statement/company-highlights`,
  };
}
