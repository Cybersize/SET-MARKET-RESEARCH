import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import Fuse from 'fuse.js';
import { useCompanies } from '@/hooks/useCompanies';
import { useSyncLogs } from '@/hooks/useSyncLogs';
import { Company } from '@/types';
import { Layout } from '@/components/Layout';
import { CompanyModal } from '@/components/CompanyModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building2,
  Factory,
  LayoutGrid,
  TrendingUp,
  Search,
  Download,
  FileSpreadsheet,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
  Eye,
  Calendar,
} from 'lucide-react';
import * as XLSX from 'xlsx';

const fuseOptions = {
  keys: ['symbol', 'symbol_name', 'market', 'sector', 'industry', 'description'],
  threshold: 0.3,
  includeScore: true,
};

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: React.ElementType; accent?: boolean }) {
  return (
    <Card className="border-border bg-card" data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-2.5 rounded-lg ${accent ? 'bg-accent/20' : 'bg-primary/10'}`}>
          <Icon className={`h-5 w-5 ${accent ? 'text-accent' : 'text-primary'}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{label}</p>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { companies, loading } = useCompanies();
  const { logs } = useSyncLogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const stats = useMemo(() => {
    const industries = new Set(companies.map(c => c.industry).filter(Boolean));
    const sectors = new Set(companies.map(c => c.sector).filter(Boolean));
    const setCount = companies.filter(c => c.market === 'SET').length;
    const maiCount = companies.filter(c => c.market === 'mai').length;
    const lastSync = logs[0]?.started_at ? new Date(logs[0].started_at).toLocaleDateString() : 'Never';
    return { total: companies.length, industries: industries.size, sectors: sectors.size, setCount, maiCount, lastSync };
  }, [companies, logs]);

  const uniqueIndustries = useMemo(() => {
    const all = companies.map(c => c.industry).filter(Boolean);
    return [...new Set(all)].sort();
  }, [companies]);

  const uniqueSectors = useMemo(() => {
    const pool = industryFilter === 'all' ? companies : companies.filter(c => c.industry === industryFilter);
    const all = pool.map(c => c.sector).filter(Boolean);
    return [...new Set(all)].sort();
  }, [companies, industryFilter]);

  const filteredData = useMemo(() => {
    let data = companies;
    if (marketFilter !== 'all') data = data.filter(c => c.market === marketFilter);
    if (industryFilter !== 'all') data = data.filter(c => c.industry === industryFilter);
    if (sectorFilter !== 'all') data = data.filter(c => c.sector === sectorFilter);

    if (searchQuery.trim()) {
      const fuse = new Fuse(data, fuseOptions);
      return fuse.search(searchQuery).map(r => r.item);
    }
    return data;
  }, [companies, marketFilter, industryFilter, sectorFilter, searchQuery]);

  const columns = useMemo<ColumnDef<Company>[]>(() => [
    {
      accessorKey: 'market',
      header: 'Market',
      cell: ({ getValue }) => {
        const v = getValue() as string;
        return (
          <Badge
            className={`font-mono text-xs font-bold px-1.5 py-0.5 ${v === 'SET' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-accent/20 text-accent border-accent/30'} border`}
            variant="outline"
            data-testid="badge-market"
          >
            {v}
          </Badge>
        );
      },
      size: 80,
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
      size: 140,
    },
    {
      accessorKey: 'sector',
      header: 'Sector',
      size: 140,
    },
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: ({ getValue }) => (
        <span className="font-mono font-bold text-primary text-sm">{getValue() as string}</span>
      ),
      size: 100,
    },
    {
      accessorKey: 'symbol_name',
      header: 'Name',
      size: 200,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ getValue }) => {
        const v = (getValue() as string) || '';
        const truncated = v.length > 80 ? v.slice(0, 80) + '...' : v;
        return (
          <span className="text-muted-foreground text-sm" title={v}>{truncated || '—'}</span>
        );
      },
      size: 300,
      enableSorting: false,
    },
    {
      accessorKey: 'report_download_link',
      header: 'Report',
      cell: ({ getValue }) => {
        const url = getValue() as string;
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-primary hover:text-primary/80 transition-colors"
            data-testid="link-report"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : <span className="text-muted-foreground">—</span>;
      },
      enableSorting: false,
      size: 70,
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });

  const exportCSV = useCallback(() => {
    const rows = filteredData.map(c => ({
      Market: c.market,
      Industry: c.industry,
      Sector: c.sector,
      Symbol: c.symbol,
      'Symbol Name': c.symbol_name,
      Description: c.description,
      'Company Website': c.company_website,
      'Report Link': c.report_download_link,
    }));
    const header = Object.keys(rows[0] || {}).join(',');
    const csv = [header, ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'set_companies.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredData]);

  const exportExcel = useCallback(() => {
    const rows = filteredData.map(c => ({
      Market: c.market,
      Industry: c.industry,
      Sector: c.sector,
      Symbol: c.symbol,
      'Symbol Name': c.symbol_name,
      Description: c.description,
      'Company Website': c.company_website,
      'Report Link': c.report_download_link,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Companies');
    XLSX.writeFile(wb, 'set_companies.xlsx');
  }, [filteredData]);

  const SortIcon = ({ col }: { col: { getIsSorted: () => false | 'asc' | 'desc'; getCanSort: () => boolean } }) => {
    if (!col.getCanSort()) return null;
    const sorted = col.getIsSorted();
    if (sorted === 'asc') return <ChevronUp className="h-3 w-3 ml-1 inline" />;
    if (sorted === 'desc') return <ChevronDown className="h-3 w-3 ml-1 inline" />;
    return <ChevronsUpDown className="h-3 w-3 ml-1 inline opacity-40" />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Companies" value={stats.total} icon={Building2} />
          <StatCard label="Industries" value={stats.industries} icon={Factory} />
          <StatCard label="Sectors" value={stats.sectors} icon={LayoutGrid} />
          <StatCard label="SET" value={stats.setCount} icon={TrendingUp} />
          <StatCard label="mai" value={stats.maiCount} icon={TrendingUp} accent />
          <StatCard label="Last Sync" value={stats.lastSync} icon={Calendar} />
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search symbols, names, sectors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 font-mono text-sm bg-card border-border"
              data-testid="input-search"
            />
          </div>

          <Select value={marketFilter} onValueChange={v => { setMarketFilter(v); setSectorFilter('all'); }}>
            <SelectTrigger className="w-32 bg-card border-border text-sm" data-testid="select-market">
              <SelectValue placeholder="Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="SET">SET</SelectItem>
              <SelectItem value="mai">mai</SelectItem>
            </SelectContent>
          </Select>

          <Select value={industryFilter} onValueChange={v => { setIndustryFilter(v); setSectorFilter('all'); }}>
            <SelectTrigger className="w-44 bg-card border-border text-sm" data-testid="select-industry">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {uniqueIndustries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-44 bg-card border-border text-sm" data-testid="select-sector">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {uniqueSectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1.5 ml-auto">
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 text-xs bg-card" data-testid="button-export-csv">
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportExcel} className="gap-1.5 text-xs bg-card" data-testid="button-export-excel">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs bg-card" data-testid="button-column-toggle">
                  <Eye className="h-3.5 w-3.5" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs">Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table.getAllColumns().filter(col => col.getCanHide()).map(col => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={v => col.toggleVisibility(v)}
                    className="text-sm capitalize"
                  >
                    {col.id.replace(/_/g, ' ')}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0 z-10">
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id} className="border-b border-border">
                    {hg.headers.map(header => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors"
                        style={{ width: header.column.getSize() }}
                        onClick={header.column.getToggleSortingHandler()}
                        data-testid={`th-${header.id}`}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon col={header.column} />
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      {columns.map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-full max-w-32" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-16 text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-3 opacity-30" />
                      <p className="font-mono text-sm">No companies found</p>
                      <p className="text-xs mt-1">Try adjusting search or filters, or sync data in Admin.</p>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr
                      key={row.id}
                      className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedCompany(row.original)}
                      data-testid={`row-company-${row.original.symbol}`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-2.5 max-w-xs">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span>
                {filteredData.length > 0
                  ? `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of ${filteredData.length}`
                  : '0 results'}
              </span>
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={v => table.setPageSize(Number(v))}
              >
                <SelectTrigger className="h-7 w-20 text-xs bg-card border-border" data-testid="select-page-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[25, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 bg-card" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} data-testid="button-prev-page">Prev</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 bg-card" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} data-testid="button-next-page">Next</Button>
            </div>
          </div>
        </div>
      </div>

      {selectedCompany && (
        <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
      )}
    </Layout>
  );
}
