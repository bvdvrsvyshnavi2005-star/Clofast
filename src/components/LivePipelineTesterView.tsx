import React, { useState } from 'react';
import { INTEGRATION_CATEGORIES } from '../data/companies';
import { CompanyEntity } from '../types/integration';
import { Play, ArrowRight, CheckCircle2, RefreshCw, Zap, Server, ShieldCheck, Code2 } from 'lucide-react';

interface LivePipelineTesterViewProps {
  onTrigger3DPulse: (sourceId: string, targetId: string) => void;
  onNavigateTo3D: () => void;
}

export const LivePipelineTesterView: React.FC<LivePipelineTesterViewProps> = ({
  onTrigger3DPulse,
  onNavigateTo3D
}) => {
  const allCompanies: CompanyEntity[] = INTEGRATION_CATEGORIES.flatMap((c) => c.companies);

  const [sourceId, setSourceId] = useState<string>('salesforce');
  const [targetId, setTargetId] = useState<string>('netsuite');
  const [transformRule, setTransformRule] = useState<string>('lead_to_cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncResult, setSyncResult] = useState<any | null>(null);

  const sourceCompany = allCompanies.find((c) => c.id === sourceId) || allCompanies[0];
  const targetCompany = allCompanies.find((c) => c.id === targetId) || allCompanies[3];

  const handleRunSync = () => {
    setIsProcessing(true);
    onTrigger3DPulse(sourceId, targetId);

    setTimeout(() => {
      setIsProcessing(false);
      setSyncResult({
        transactionId: 'TXN-CLOFAST-' + Math.floor(100000 + Math.random() * 900000),
        source: sourceCompany.name,
        target: targetCompany.name,
        transformation: transformRule,
        status: 'COMPLETED_200_OK',
        durationMs: 14.2,
        throughputBytes: 18492,
        canonicalPayload: {
          timestamp: new Date().toISOString(),
          unifiedEnvelopeId: 'ENV_77491028',
          sourceEntity: {
            system: sourceCompany.name,
            recordId: 'SRC_' + Math.floor(1000 + Math.random() * 9000),
            category: sourceCompany.categoryTitle
          },
          cloFastEnrichment: {
            taxRuleApplied: 'AVALARA_GLOBAL_2026',
            deduplicationHash: 'd3b07384d113edec49eaa6238ad5ff00',
            currencyNormalized: 'USD'
          },
          targetEntity: {
            system: targetCompany.name,
            syncedId: 'DEST_' + Math.floor(1000 + Math.random() * 9000),
            ackStatus: 'Acknowledged_By_Remote_Cluster'
          }
        }
      });
    }, 900);
  };

  return (
    <div className="pt-20 pb-28 px-4 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20">
            Interactive Sync Simulator
          </span>
          <span className="text-xs text-slate-400">Clofast Transformation & Routing Gateway</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Live Data Pipeline & Transformation Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure a real-time data sync pipeline between any CRM, ERP, Commerce, or Payment connector and observe the canonical schema output.
        </p>
      </div>

      {/* Pipeline Builder Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Source Column */}
        <div className="bg-[#070e24] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-300 font-bold">1</span>
            <span>Origin Source Node</span>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Select Ingestion Connector</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              {allCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryTitle}: {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="text-white font-semibold">{sourceCompany.categoryTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Latency:</span>
              <span className="text-emerald-400 font-mono font-semibold">{sourceCompany.pingMs} ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Auth:</span>
              <span className="text-slate-300 font-mono text-[11px] truncate max-w-[140px]">{sourceCompany.authType}</span>
            </div>
          </div>
        </div>

        {/* Middle: Clofast Transformation Engine */}
        <div className="bg-[#091129] border border-sky-500/40 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 font-bold">2</span>
            <span>Clofast Nexus Engine</span>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Transformation & Business Logic</label>
            <select
              value={transformRule}
              onChange={(e) => setTransformRule(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="lead_to_cash">CRM Lead-to-Cash (Quote to SO)</option>
              <option value="canonical_enrichment">Canonical Schema & Tax Enrichment</option>
              <option value="edi_x12_translation">EDI X12 850 PO to JSON Transformation</option>
              <option value="inventory_reconciliation">Real-time Multi-Warehouse Inventory Sync</option>
              <option value="payment_settlement">Payment Settlement & AR Journal Posting</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>Security Standard:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SOC2 Type II
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Validation:</span>
              <span className="text-sky-300 font-mono">XSD & JSONSchema v7</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Deduplication:</span>
              <span className="text-amber-400 font-mono">MD5 / SHA256 Fingerprint</span>
            </div>
          </div>
        </div>

        {/* Destination Column */}
        <div className="bg-[#070e24] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold">3</span>
            <span>Target Destination Node</span>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Select Output Connector</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {allCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryTitle}: {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="text-white font-semibold">{targetCompany.categoryTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Response SLA:</span>
              <span className="text-emerald-400 font-mono font-semibold">{targetCompany.pingMs} ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sync:</span>
              <span className="text-slate-300 font-mono text-[11px] truncate max-w-[140px]">{targetCompany.syncFrequency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button: Run Sync */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleRunSync}
          disabled={isProcessing}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Transforming & Dispatching Data Packets...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Execute Live Data Pipeline & Fire 3D Stream</span>
            </>
          )}
        </button>

        <button
          onClick={onNavigateTo3D}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-colors border border-slate-700"
        >
          Watch in 3D Scene
        </button>
      </div>

      {/* Result Display */}
      {syncResult && (
        <div className="bg-[#070e24] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Pipeline Ingested & Transformed Successfully</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">TXN: <strong className="text-white">{syncResult.transactionId}</strong></span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {syncResult.durationMs} ms
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Transformed Canonical JSON Output:</span>
            </div>
            <pre className="p-4 rounded-xl bg-[#040817] border border-slate-800 font-mono text-xs text-sky-200 overflow-x-auto max-h-64 scrollbar-thin">
              {JSON.stringify(syncResult.canonicalPayload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
