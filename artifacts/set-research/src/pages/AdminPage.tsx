import { useState, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { useCompanies } from '@/hooks/useCompanies';
import { useSyncLogs } from '@/hooks/useSyncLogs';
import { parseCsv, importCsvToFirestore, type CsvRow } from '@/lib/csvImporter';
import { SyncProgress, SyncLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Activity,
  ChevronDown,
  ChevronUp,
  Plug,
  Terminal,
  Upload,
  FileText,
  X,
} from 'lucide-react';

function formatDate(d: string) {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return d; }
}

function SyncLogRow({ log }: { log: SyncLog }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <Badge
          className={`text-xs font-mono font-bold px-2 shrink-0 ${log.success ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-destructive/20 text-destructive border-destructive/30'} border`}
          variant="outline"
        >
          {log.success ? 'OK' : 'FAIL'}
        </Badge>
        {log.source === 'csv' && (
          <Badge variant="outline" className="text-xs font-mono px-1.5 border-border text-muted-foreground shrink-0">CSV</Badge>
        )}
        <span className="font-mono text-xs text-muted-foreground shrink-0">{formatDate(log.started_at)}</span>
        {log.filename && <span className="font-mono text-xs text-muted-foreground truncate max-w-40">{log.filename}</span>}
        <div className="flex gap-3 ml-2 text-xs font-mono text-muted-foreground">
          <span className="text-emerald-400">+{log.total_imported} new</span>
          <span className="text-primary">~{log.total_updated} updated</span>
          {log.failed_symbols.length > 0 && (
            <span className="text-destructive">{log.failed_symbols.length} failed</span>
          )}
        </div>
        <div className="ml-auto">
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border space-y-3 bg-muted/10">
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div><span className="text-muted-foreground">Started: </span><span>{formatDate(log.started_at)}</span></div>
            <div><span className="text-muted-foreground">Finished: </span><span>{formatDate(log.finished_at)}</span></div>
          </div>
          {log.failed_symbols.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Failed symbols:</p>
              <div className="flex flex-wrap gap-1">
                {log.failed_symbols.map(s => (
                  <Badge key={s} variant="outline" className="font-mono text-xs text-destructive border-destructive/30 bg-destructive/10">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          {log.error_logs.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Error log:</p>
              <div className="bg-background rounded border border-border p-2 max-h-40 overflow-y-auto">
                {log.error_logs.map((e, i) => (
                  <p key={i} className="text-xs font-mono text-destructive">{e}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const IDLE_PROGRESS: SyncProgress = {
  phase: 'idle', total: 0, current: 0,
  imported: 0, updated: 0, failed: [], errors: [], message: '',
};

export function AdminPage() {
  const { companies } = useCompanies();
  const { logs, loading: logsLoading, refetch: refetchLogs } = useSyncLogs();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<SyncProgress>(IDLE_PROGRESS);
  const [lastResult, setLastResult] = useState<{ success: boolean; log: SyncLog } | null>(null);
  const [parsedRows, setParsedRows] = useState<CsvRow[] | null>(null);
  const [parsedFilename, setParsedFilename] = useState('');
  const [parseError, setParseError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [testPath, setTestPath] = useState('/api/set-proxy/financial-statement/last-update-date');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: number; body: string } | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setParseError('');
    setParsedRows(null);
    setLastResult(null);
    if (!file.name.endsWith('.csv')) {
      setParseError('Please select a .csv file.');
      return;
    }
    try {
      const rows = await parseCsv(file);
      setParsedRows(rows);
      setParsedFilename(file.name);
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    if (!parsedRows || parsedRows.length === 0) return;
    setImporting(true);
    setLastResult(null);
    setProgress({ ...IDLE_PROGRESS, phase: 'saving', message: 'Starting import…' });
    try {
      const log = await importCsvToFirestore(parsedRows, setProgress, parsedFilename);
      setLastResult({ success: log.success, log });
      setParsedRows(null);
      await refetchLogs();
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLastResult({ success: false, log: { id: '', started_at: new Date().toISOString(), finished_at: new Date().toISOString(), total_imported: 0, total_updated: 0, success: false, failed_symbols: [], error_logs: [msg], source: 'csv', filename: parsedFilename } });
    } finally {
      setImporting(false);
    }
  };

  const handleTestApi = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(testPath);
      const text = await res.text();
      let body = text;
      try { body = JSON.stringify(JSON.parse(text), null, 2); } catch { /* keep raw */ }
      setTestResult({ status: res.status, body: body.slice(0, 3000) });
    } catch (err: unknown) {
      setTestResult({ status: 0, body: `Network error: ${err instanceof Error ? err.message : String(err)}` });
    } finally {
      setTesting(false);
    }
  };

  const progressPercent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  const lastSync = logs[0];

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mt-1">Import company data from CSV and manage the Firestore database.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase">Total Companies</p>
                <p className="text-xl font-bold font-mono">{companies.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase">Import Sessions</p>
                <p className="text-xl font-bold font-mono">{logs.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase">Last Import</p>
                <p className="text-sm font-mono font-medium">{lastSync ? formatDate(lastSync.started_at) : 'Never'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CSV Import */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Import from CSV</CardTitle>
            </div>
            <CardDescription>
              Upload your SET factsheet CSV file. Required columns: <span className="font-mono text-xs">market, sector, symbol, symbol_name, description, link_website, one_report_link, last_updated_at</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drop zone */}
            {!parsedRows && !importing && (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/10'}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-medium">Click to select</span> or drag & drop a CSV file
                </p>
                <p className="text-xs text-muted-foreground mt-1">UTF-8 encoded, comma-separated</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            )}

            {/* Parse error */}
            {parseError && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-destructive">{parseError}</p>
              </div>
            )}

            {/* Parsed preview */}
            {parsedRows && !importing && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="flex-1 text-xs font-mono">
                    <span className="text-emerald-400 font-semibold">{parsedRows.length} companies</span>
                    <span className="text-muted-foreground"> parsed from </span>
                    <span className="text-foreground">{parsedFilename}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => { setParsedRows(null); setParseError(''); }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/20 border border-border text-xs font-mono flex-1">
                    <span className="text-muted-foreground">SET:</span>
                    <span>{parsedRows.filter(r => r.market === 'SET').length}</span>
                    <span className="text-muted-foreground ml-3">mai:</span>
                    <span>{parsedRows.filter(r => r.market === 'mai').length}</span>
                    <span className="text-muted-foreground ml-3">Sectors:</span>
                    <span>{new Set(parsedRows.map(r => r.sector)).size}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-accent/90 leading-relaxed">
                    Existing records will be updated in place. New records will be added. This may take a few minutes for large files.
                  </p>
                </div>

                <Button onClick={handleImport} className="gap-2 font-mono w-full">
                  <Upload className="h-4 w-4" />
                  Import {parsedRows.length} companies to Firestore
                </Button>
              </div>
            )}

            {/* Progress */}
            {importing && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>{progress.message}</span>
                  {progress.total > 0 && <span>{progress.current}/{progress.total}</span>}
                </div>
                <Progress value={progressPercent} className="h-2" />
                <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                  <span className="text-emerald-400">+{progress.imported} new</span>
                  <span className="text-primary">~{progress.updated} updated</span>
                  {progress.failed.length > 0 && <span className="text-destructive">{progress.failed.length} failed</span>}
                </div>
              </div>
            )}

            {/* Result */}
            {lastResult && !importing && (
              <div className={`flex items-start gap-3 p-3 rounded-lg border ${lastResult.success ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-destructive/10 border-destructive/30'}`}>
                {lastResult.success
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  : <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />}
                <div className="space-y-1 text-xs font-mono">
                  <p className={lastResult.success ? 'text-emerald-400' : 'text-destructive'}>
                    {lastResult.success ? 'Import completed successfully' : 'Import failed'}
                  </p>
                  <p className="text-muted-foreground">
                    {lastResult.log.total_imported} new · {lastResult.log.total_updated} updated · {lastResult.log.failed_symbols.length} failed
                  </p>
                </div>
              </div>
            )}

            {/* Re-select after done */}
            {lastResult && !importing && (
              <Button variant="outline" size="sm" className="gap-2 font-mono text-xs" onClick={() => { setLastResult(null); fileInputRef.current?.click(); }}>
                <Upload className="h-3.5 w-3.5" /> Import another file
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Import History */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Import History</CardTitle>
            <CardDescription>Last {Math.min(logs.length, 20)} import sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {logsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : logs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Activity className="h-7 w-7 mx-auto mb-2 opacity-30" />
                <p className="font-mono text-sm">No import history yet</p>
              </div>
            ) : (
              logs.slice(0, 20).map(log => <SyncLogRow key={log.id} log={log} />)
            )}
          </CardContent>
        </Card>

        {/* API Connection Tester */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Plug className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">API Connection Tester</CardTitle>
            </div>
            <CardDescription>Test any proxy endpoint. The proxy injects your SET API key automatically.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-muted-foreground">Proxy path to test</Label>
              <div className="flex gap-2">
                <Input
                  value={testPath}
                  onChange={e => setTestPath(e.target.value)}
                  className="font-mono text-xs bg-background border-border"
                  placeholder="/api/set-proxy/..."
                />
                <Button onClick={handleTestApi} disabled={testing} size="sm" variant="outline" className="shrink-0 gap-1.5 font-mono">
                  <Terminal className={`h-3.5 w-3.5 ${testing ? 'animate-pulse' : ''}`} />
                  {testing ? 'Testing…' : 'Test'}
                </Button>
              </div>
            </div>
            {testResult && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`font-mono text-xs ${testResult.status >= 200 && testResult.status < 300 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-destructive border-destructive/30 bg-destructive/10'}`}
                  >
                    HTTP {testResult.status || 'ERR'}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono truncate">{testPath}</span>
                </div>
                <pre className="text-xs font-mono text-muted-foreground bg-background rounded-lg p-3 border border-border overflow-x-auto max-h-64 leading-relaxed whitespace-pre-wrap">
                  {testResult.body}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Firestore Security Rules */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Firestore Security Rules</CardTitle>
            <CardDescription>Apply these rules in Firebase console → Firestore Database → Rules.</CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-3 bg-border" />
            <pre className="text-xs font-mono text-muted-foreground bg-background rounded-lg p-4 border border-border overflow-x-auto leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
