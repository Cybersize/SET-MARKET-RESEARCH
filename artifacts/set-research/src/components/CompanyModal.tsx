import { Company } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, FileText, Globe, Calendar, Factory, LayoutGrid } from 'lucide-react';

interface CompanyModalProps {
  company: Company;
  onClose: () => void;
}

function DetailRow({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export function CompanyModal({ company, onClose }: CompanyModalProps) {
  const formatDate = (d: string) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden" data-testid="modal-company">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-2xl text-primary" data-testid="text-symbol">{company.symbol}</span>
                  <Badge
                    className={`font-mono text-xs font-bold px-2 py-0.5 ${company.market === 'SET' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-accent/20 text-accent border-accent/30'} border`}
                    variant="outline"
                    data-testid="badge-market-modal"
                  >
                    {company.market}
                  </Badge>
                </div>
                <DialogTitle className="text-base font-semibold text-foreground leading-tight" data-testid="text-company-name">
                  {company.symbol_name}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-5 space-y-5">
            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Industry" value={company.industry} icon={Factory} />
              <DetailRow label="Sector" value={company.sector} icon={LayoutGrid} />
              {company.isin_code && <DetailRow label="ISIN" value={company.isin_code} />}
              {company.ipo_date && <DetailRow label="IPO Date" value={company.ipo_date} />}
              {company.headquarters && <DetailRow label="HQ" value={company.headquarters} />}
              {company.market_cap && <DetailRow label="Market Cap" value={company.market_cap} />}
            </div>

            <Separator className="bg-border" />

            {/* Description */}
            {company.description && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Business Description</p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-description">
                  {company.description}
                </p>
              </div>
            )}

            <Separator className="bg-border" />

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {company.company_website && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs bg-card border-border"
                  asChild
                  data-testid="button-website"
                >
                  <a href={company.company_website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-3.5 w-3.5" />
                    Company Website
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                </Button>
              )}
              {company.report_download_link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs bg-card border-border"
                  asChild
                  data-testid="button-report"
                >
                  <a href={company.report_download_link} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-3.5 w-3.5" />
                    Financial Report
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                </Button>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> Updated
                </span>
                <span className="text-xs font-mono text-muted-foreground" data-testid="text-updated-at">
                  {formatDate(company.updated_at)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> Imported
                </span>
                <span className="text-xs font-mono text-muted-foreground" data-testid="text-imported-at">
                  {formatDate(company.imported_at)}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
