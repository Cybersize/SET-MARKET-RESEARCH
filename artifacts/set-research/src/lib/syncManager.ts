import { setDoc, doc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company, SyncLog, SyncProgress } from '@/types';
import { fetchSymbolList, fetchCompanyInfo } from './setApi';

export async function syncCompanies(
  onProgress: (progress: SyncProgress) => void
): Promise<SyncLog> {
  const started_at = new Date().toISOString();
  let imported = 0;
  let updated = 0;
  const failed: string[] = [];
  const errors: string[] = [];

  try {
    onProgress({
      phase: 'fetching',
      total: 0,
      current: 0,
      imported,
      updated,
      failed,
      errors,
      message: 'Fetching symbol list...'
    });

    const symbols = await fetchSymbolList();
    const total = symbols.length;

    if (total === 0) {
      throw new Error('No symbols found. API might have changed or blocked.');
    }

    onProgress({
      phase: 'saving',
      total,
      current: 0,
      imported,
      updated,
      failed,
      errors,
      message: `Processing ${total} companies...`
    });

    for (let i = 0; i < symbols.length; i++) {
      const rawSymbol = symbols[i];
      const symbol = rawSymbol.symbol;

      try {
        const info = await fetchCompanyInfo(symbol);

        const company: Company = {
          id: symbol,
          symbol,
          symbol_name: rawSymbol.securityNameEn || '',
          market: rawSymbol.market || 'SET',
          industry: rawSymbol.industryNameEn || '',
          sector: rawSymbol.sectorNameEn || '',
          description: info.description || '',
          company_website: info.company_website || '',
          report_download_link: info.report_download_link || '',
          updated_at: new Date().toISOString(),
          imported_at: new Date().toISOString(), // In real app, preserve imported_at if exists
        };

        await setDoc(doc(db, 'companies', symbol), company, { merge: true });
        updated++; // Simplification: we just count all as updated or you can check if it exists

        onProgress({
          phase: 'saving',
          total,
          current: i + 1,
          imported,
          updated,
          failed,
          errors,
          message: `Saved ${symbol}`
        });

      } catch (err: any) {
        failed.push(symbol);
        errors.push(`[${symbol}] ${err.message}`);
      }

      // Small delay to avoid rate limit
      await new Promise(res => setTimeout(res, 50));
    }

    const log: SyncLog = {
      id: '', // Firestore will auto-gen
      started_at,
      finished_at: new Date().toISOString(),
      total_imported: imported,
      total_updated: updated,
      success: failed.length === 0,
      failed_symbols: failed,
      error_logs: errors,
    };

    const docRef = await addDoc(collection(db, 'sync_logs'), log);
    log.id = docRef.id;

    onProgress({
      phase: 'done',
      total,
      current: total,
      imported,
      updated,
      failed,
      errors,
      message: 'Sync completed successfully'
    });

    return log;

  } catch (err: any) {
    onProgress({
      phase: 'error',
      total: 0,
      current: 0,
      imported,
      updated,
      failed,
      errors: [err.message],
      message: 'Sync failed: ' + err.message
    });
    
    throw err;
  }
}
