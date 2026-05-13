import Papa from 'papaparse';
import { setDoc, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company, SyncLog, SyncProgress } from '@/types';

export interface CsvRow {
  market: string;
  sector: string;
  symbol: string;
  symbol_name: string;
  description: string;
  link_website: string;
  one_report_link: string;
  last_updated_at: string;
}

const REQUIRED_HEADERS = ['market', 'sector', 'symbol', 'symbol_name', 'description', 'link_website', 'one_report_link', 'last_updated_at'];

export function parseCsv(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      transformHeader: (h) => h.trim().replace(/^\uFEFF/, ''), // strip BOM
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        const missing = REQUIRED_HEADERS.filter(h => !headers.includes(h));
        if (missing.length > 0) {
          reject(new Error(`CSV is missing columns: ${missing.join(', ')}`));
          return;
        }
        resolve(results.data);
      },
      error: (err) => reject(new Error(err.message)),
    });
  });
}

export async function importCsvToFirestore(
  rows: CsvRow[],
  onProgress: (p: SyncProgress) => void,
  filename: string,
): Promise<SyncLog> {
  const started_at = new Date().toISOString();
  let imported = 0;
  let updated = 0;
  const failed: string[] = [];
  const errors: string[] = [];
  const total = rows.length;

  onProgress({ phase: 'saving', total, current: 0, imported, updated, failed, errors, message: `Writing ${total} companies to database…` });

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const symbol = row.symbol?.trim();
    if (!symbol) continue;

    try {
      const ref = doc(db, 'companies', symbol);
      const existing = await getDoc(ref);
      const isNew = !existing.exists();

      const company: Company = {
        id: symbol,
        market: (row.market?.trim() as 'SET' | 'mai') || 'SET',
        sector: row.sector?.trim() || '',
        symbol,
        symbol_name: row.symbol_name?.trim() || '',
        description: row.description?.trim() || '',
        link_website: row.link_website?.trim() || '',
        one_report_link: row.one_report_link?.trim() || '',
        last_updated_at: row.last_updated_at?.trim() || '',
        imported_at: isNew ? new Date().toISOString() : (existing.data()?.imported_at ?? new Date().toISOString()),
        updated_at: new Date().toISOString(),
      };

      await setDoc(ref, company, { merge: true });
      if (isNew) imported++; else updated++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      failed.push(symbol);
      errors.push(`[${symbol}] ${msg}`);
    }

    if (i % 10 === 0 || i === rows.length - 1) {
      onProgress({ phase: 'saving', total, current: i + 1, imported, updated, failed, errors, message: `[${i + 1}/${total}] Writing to Firestore…` });
    }
  }

  const log: SyncLog = {
    id: '',
    started_at,
    finished_at: new Date().toISOString(),
    total_imported: imported,
    total_updated: updated,
    success: failed.length === 0,
    failed_symbols: failed,
    error_logs: errors,
    source: 'csv',
    filename,
  };

  const docRef = await addDoc(collection(db, 'sync_logs'), log);
  log.id = docRef.id;

  onProgress({ phase: 'done', total, current: total, imported, updated, failed, errors, message: `Done — ${imported} new, ${updated} updated${failed.length > 0 ? `, ${failed.length} failed` : ''}` });

  return log;
}
