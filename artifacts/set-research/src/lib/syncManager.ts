import { setDoc, doc, collection, addDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SyncLog, SyncProgress } from '@/types';
import { fetchSymbolList, fetchFinancialStatement, buildCompany } from './setApi';

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
      phase: 'fetching', total: 0, current: 0,
      imported, updated, failed, errors,
      message: 'Loading company list...'
    });

    const companies = await fetchSymbolList();
    const total = companies.length;

    if (total === 0) {
      throw new Error('Company list is empty. Check the API server is running.');
    }

    onProgress({
      phase: 'saving', total, current: 0,
      imported, updated, failed, errors,
      message: `Processing ${total} companies...`
    });

    for (let i = 0; i < companies.length; i++) {
      const raw = companies[i];
      const symbol = raw.symbol;

      try {
        // Check if the document already exists in Firestore
        const existingRef = doc(db, 'companies', symbol);
        const existingSnap = await getDoc(existingRef);
        const isNew = !existingSnap.exists();

        // Fetch financial statement from SET Marketplace API
        const financials = await fetchFinancialStatement(symbol);

        const company = buildCompany(raw, financials);
        // Preserve original imported_at if record already exists
        if (!isNew) {
          company.imported_at = existingSnap.data()?.imported_at ?? company.imported_at;
        }

        await setDoc(existingRef, company, { merge: true });

        if (isNew) imported++;
        else updated++;

        onProgress({
          phase: 'saving', total, current: i + 1,
          imported, updated, failed, errors,
          message: `[${i + 1}/${total}] ${symbol} — ${financials.length > 0 ? `${financials.length} financial records` : 'static data only'}`
        });

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        failed.push(symbol);
        errors.push(`[${symbol}] ${msg}`);
      }

      // Small delay to avoid hammering the API
      await new Promise(res => setTimeout(res, 100));
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
    };

    const docRef = await addDoc(collection(db, 'sync_logs'), log);
    log.id = docRef.id;

    onProgress({
      phase: 'done', total, current: total,
      imported, updated, failed, errors,
      message: `Done — ${imported} new, ${updated} updated, ${failed.length} failed`
    });

    return log;

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    onProgress({
      phase: 'error', total: 0, current: 0,
      imported, updated, failed,
      errors: [msg],
      message: 'Sync failed: ' + msg
    });
    throw err;
  }
}
