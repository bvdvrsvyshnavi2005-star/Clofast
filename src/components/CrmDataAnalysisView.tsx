import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';
import { PIPELINE_METRICS, INITIAL_SYNC_LOGS, INTEGRATION_CATEGORIES } from '../data/companies';
import { SyncLogEvent, CompanyEntity } from '../types/integration';

interface CrmDataAnalysisViewProps {
  onSelectCompany: (company: CompanyEntity) => void;
  onTriggerPulse: (sourceId: string, targetId: string) => void;
}

export const CrmDataAnalysisView: React.FC<CrmDataAnalysisViewProps> = ({
  onSelectCompany,
  onTriggerPulse
}) => {
  const [logs, setLogs] = useState<SyncLogEvent[]>(INITIAL_SYNC_LOGS);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [throughputHistory, setThroughputHistory] = useState<number[]>([
    21000, 22400, 24100, 23800, 25200, 24900, 26300, 25800, 27400, 28100, 27900, 29200
  ]);
  const [activeTab, setActiveTab] = useState<'stream' | 'matrix'>('stream');

  // Stream new live events periodically to make it dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      const sources = ['Salesforce', 'HubSpot', 'Shopify', 'Oracle NetSuite', 'Stripe', 'EDI'];
      const targets = ['Oracle NetSuite', 'SAP', 'Salesforce', 'Stripe', 'PDF Engine', 'API Gateway'];
      const types = [
        'Opportunity Sync -> SalesOrder',
        'Lead Stage Qualified (MQL)',
        'Payment Authorized & Captured',
        'EDI 850 PO Ingested',
        'Customer Master Record Update'
      ];

      const s = sources[Math.floor(Math.random() * sources.length)];
      const t = targets[Math.floor(Math.random() * targets.length)];
      const type = types[Math.floor(Math.random() * types.length)];

      const newLog: SyncLogEvent = {
        id: 'log-' + Date.now(),
        timestamp: 'Just now',
        source: s,
        target: t,
        category: 'crm',
        recordType: type,
        recordId: 'REC-' + Math.floor(1000 + Math.random() * 9000),
        status: 'success',
        latencyMs: Math.floor(8 + Math.random() * 18),
        payloadSizeKb: +(4 + Math.random() * 25).toFixed(1)
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
      setThroughputHistory((prev) => [
        ...prev.slice(1),
        Math.floor(25000 + Math.random() * 6000)
      ]);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = selectedFilter === 'all' || log.category === selectedFilter;
    const matchesSearch =
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recordType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recordId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20 pb-24 px-4 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Mission */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20">
              Enterprise Telemetry
            </span>
            <span className="text-xs text-slate-400">Clofast Real-Time Connection Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            CRM Connection & Data Analysis
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Bi-directional lead-to-ledger synchronization, deal pipeline analytics, and high-velocity transaction metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTriggerPulse('salesforce', 'netsuite')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Pipeline Burst</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_METRICS.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-[#070e24] border border-slate-800/90 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-sky-500/40 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{kpi.metric}</span>
              <span className="text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {kpi.change}
              </span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight font-mono">{kpi.value}</div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Real-time continuous sync</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive CRM Lead-to-Cash Data Flow Architecture */}
      <div className="bg-[#070e24] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" />
              <span>End-to-End Enterprise CRM Data Pipeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              How customer deals transform and flow through Clofast Canonical Transformation
            </p>
          </div>
          <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20 self-start sm:self-auto">
            Zero-Data-Loss Guaranteed
          </span>
        </div>

        {/* Pipeline Diagram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* Step 1: CRM Ingestion */}
          <div className="bg-[#0d1635] border border-sky-600/30 p-4 rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">1. CRM Ingestion</span>
            <div className="font-bold text-white text-sm">HubSpot & Salesforce</div>
            <p className="text-xs text-slate-300">
              MQL Leads, Opportunity Stage Changes, and CPQ Line Items captured via Webhooks & CDC.
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-700/60">
              Latency: 11ms
            </div>
          </div>

          <div className="hidden md:flex justify-center text-sky-400">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>

          {/* Step 2: Clofast Transformation Engine */}
          <div className="bg-gradient-to-br from-sky-950/80 to-blue-900/60 border border-sky-500/50 p-4 rounded-xl space-y-2 shadow-lg shadow-sky-500/10">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">2. Clofast Nexus</span>
            <div className="font-bold text-white text-sm">Canonical Schema Engine</div>
            <p className="text-xs text-slate-200">
              Validates XSD/JSON schemas, de-duplicates entities, and enriches pricing & tax codes.
            </p>
            <div className="text-[10px] font-mono text-amber-300 pt-1 border-t border-sky-700/60">
              Processing: 2.4ms
            </div>
          </div>

          <div className="hidden md:flex justify-center text-sky-400">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>

          {/* Step 3: ERP & Settlement */}
          <div className="bg-[#0d1635] border border-blue-600/30 p-4 rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">3. ERP & Ledger</span>
            <div className="font-bold text-white text-sm">NetSuite, SAP & Stripe</div>
            <p className="text-xs text-slate-300">
              Generates Sales Orders, allocates warehouse inventory, and authorizes payment settles.
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-700/60">
              Ack Time: 16ms
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry & Live Sync Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Sync Logs Stream */}
        <div className="lg:col-span-2 bg-[#070e24] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Live Event Stream & Transaction Ledger</span>
              </h3>
              <p className="text-xs text-slate-400">Sub-second bi-directional execution records</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('crm')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedFilter === 'crm'
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CRM
              </button>
              <button
                onClick={() => setSelectedFilter('ecommerce')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedFilter === 'ecommerce'
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Commerce
              </button>
              <button
                onClick={() => setSelectedFilter('data')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedFilter === 'data'
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EDI/API
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by system, deal ID or record..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Table / List */}
          <div className="overflow-x-auto max-h-80 scrollbar-thin space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#0b1430] hover:bg-[#0f1b40] border border-slate-800 hover:border-slate-700 p-3 rounded-xl flex items-center justify-between gap-4 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{log.source}</span>
                      <ArrowRight className="w-3 h-3 text-sky-400" />
                      <span>{log.target}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{log.recordType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:block">
                    <span className="font-mono text-sky-300 text-[11px]">{log.recordId}</span>
                    <span className="text-[10px] text-slate-500 block">{log.payloadSizeKb} KB</span>
                  </div>

                  <div>
                    <span className="text-emerald-400 font-mono font-semibold">{log.latencyMs} ms</span>
                    <span className="text-[10px] text-slate-500 block">{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Throughput Telemetry Sparkline & Connector Health */}
        <div className="bg-[#070e24] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Throughput Velocity</span>
            </h3>
            <p className="text-xs text-slate-400">Events processed per second (current: 28,400)</p>

            {/* SVG Sparkline Graph */}
            <div className="mt-4 h-28 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <path
                  d={`M 0 100 ${throughputHistory
                    .map((val, idx) => {
                      const x = (idx / (throughputHistory.length - 1)) * 300;
                      const y = 100 - ((val - 18000) / 14000) * 80;
                      return `L ${x} ${y}`;
                    })
                    .join(' ')} L 300 100 Z`}
                  fill="url(#chartGrad)"
                />
                {/* Stroke line */}
                <path
                  d={`M ${throughputHistory
                    .map((val, idx) => {
                      const x = (idx / (throughputHistory.length - 1)) * 300;
                      const y = 100 - ((val - 18000) / 14000) * 80;
                      return `${idx === 0 ? '' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* Quick Connector Health Matrix */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Category Health Matrix</span>
              <span className="text-emerald-400 text-[10px]">6/6 Healthy</span>
            </h4>

            <div className="space-y-2">
              {INTEGRATION_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-medium text-slate-200">{cat.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400">3 Nodes</span>
                    <span className="text-emerald-400 font-semibold text-[11px]">99.99%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
