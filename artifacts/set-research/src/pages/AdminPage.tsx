import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { useCompanies } from '@/hooks/useCompanies';
import { useSyncLogs } from '@/hooks/useSyncLogs';
import { syncCompanies } from '@/lib/syncManager';
import { SyncProgress, SyncLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function formatDate(d: string) {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return d; }
}

function SyncLogRow({ log }: { log: SyncLog }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden" data-testid={`log-row-${log.id}`}>
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
        <span className="font-mono text-xs text-muted-foreground shrink-0">{formatDate(log.started_at)}</span>
        <div className="flex gap-3 ml-2 text-xs font-mono text-muted-foreground">
          <span>+{log.total_imported} new</span>
          <span>~{log.total_updated} updated</span>
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

  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress>(IDLE_PROGRESS);
  const [lastResult, setLastResult] = useState<{ success: boolean; log: SyncLog } | null>(null);

  const lastSync = logs[0];

  const handleSync = async () => {
    setSyncing(true);
    setLastResult(null);
    setProgress({ ...IDLE_PROGRESS, phase: 'fetching', message: 'Starting sync...' });
    try {
      const log = await syncCompanies((p) => setProgress(p));
      setLastResult({ success: log.success, log });
      await refetchLogs();
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch (err: any) {
      setLastResult({ success: false, log: { id: '', started_at: new Date().toISOString(), finished_at: new Date().toISOString(), total_imported: 0, total_updated: 0, success: false, failed_symbols: [], error_logs: [err.message] } });
    } finally {
      setSyncing(false);
    }
  };

  const progressPercent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage data synchronization from SET Market API to Firestore.</p>
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
                <p className="text-xs text-muted-foreground font-mono uppercase">Sync Sessions</p>
                <p className="text-xl font-bold font-mono">{logs.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase">Last Sync</p>
                <p className="text-sm font-mono font-medium">{lastSync ? formatDate(lastSync.started_at) : 'Never'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sync Control */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Data Sync</CardTitle>
            <CardDescription className="text-sm">
              Fetch all company data from SET Market API and upsert into Firestore. Run every 3–5 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-accent/90 leading-relaxed">
                This will call the SET Market API and may take several minutes depending on the number of companies.
                Existing records are updated in place. The sync continues even if individual companies fail.
              </p>
            </div>

            <Button
              onClick={handleSync}
              disabled={syncing}
              className="gap-2 font-mono"
              data-testid="button-sync"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Data from SET API'}
            </Button>

            {/* Progress */}
            {syncing && progress.phase !== 'idle' && (
              <div className="space-y-3 pt-1">
                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>{progress.message}</span>
                  {progress.total > 0 && <span>{progress.current}/{progress.total}</span>}
                </div>
                <Progress value={progressPercent} className="h-2" />
                <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                  <span className="text-emerald-400">+{progress.imported} imported</span>
                  <span className="text-primary">~{progress.updated} updated</span>
                  {progress.failed.length > 0 && (
                    <span className="text-destructive">{progress.failed.length} failed</span>
                  )}
                </div>
              </div>
            )}

            {/* Result */}
            {lastResult && !syncing && (
              <div className={`flex items-start gap-3 p-3 rounded-lg border ${lastResult.success ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-destructive/10 border-destructive/30'}`}>
                {lastResult.success
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  : <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                }
                <div className="space-y-1 text-xs font-mono">
                  <p className={lastResult.success ? 'text-emerald-400' : 'text-destructive'}>
                    {lastResult.success ? 'Sync completed successfully' : 'Sync failed'}
                  </p>
                  <p className="text-muted-foreground">
                    {lastResult.log.total_imported} imported · {lastResult.log.total_updated} updated · {lastResult.log.failed_symbols.length} failed
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync Log */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sync History</CardTitle>
            <CardDescription>Last {Math.min(logs.length, 20)} sync sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {logsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : logs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Activity className="h-7 w-7 mx-auto mb-2 opacity-30" />
                <p className="font-mono text-sm">No sync history yet</p>
              </div>
            ) : (
              logs.slice(0, 20).map(log => <SyncLogRow key={log.id} log={log} />)
            )}
          </CardContent>
        </Card>

        {/* Firebase Security Rules */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Firestore Security Rules</CardTitle>
            <CardDescription>Apply these rules in your Firebase console under Firestore Database Rules.</CardDescription>
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
