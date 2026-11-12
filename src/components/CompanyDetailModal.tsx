import React, { useState } from 'react';
import { X, Copy, Check, Zap, ArrowRight, ShieldCheck, Activity, Database, CheckCircle2 } from 'lucide-react';
import { CompanyEntity } from '../types/integration';

interface CompanyDetailModalProps {
  company: CompanyEntity | null;
  onClose: () => void;
  onTriggerSyncPulse?: (sourceId: string, targetId: string) => void;
  onFocusIn3D?: (company: CompanyEntity) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  company,
  onClose,
  onTriggerSyncPulse,
  onFocusIn3D
}) => {
  const [copied, setCopied] = useState(false);
  const [syncTriggered, setSyncTriggered] = useState(false);

  if (!company) return null;

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(company.samplePayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSync = () => {
    if (onTriggerSyncPulse) {
      onTriggerSyncPulse(company.id, 'core');
    }
    setSyncTriggered(true);
    setTimeout(() => setSyncTriggered(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#091129] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Top Header with Brand Color Accent */}
        <div className="p-6 border-b border-slate-800 bg-[#060c20] flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-md border"
              style={{
                backgroundColor: company.color + '22',
                borderColor: company.color + '55',
                color: company.color
              }}
            >
              {company.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {company.categoryTitle}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ONLINE • {company.pingMs}ms
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{company.name}</h2>
              <p className="text-xs text-slate-300 mt-0.5">{company.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Overview Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">System Overview</h4>
            <p className="leading-relaxed text-slate-200">{company.description}</p>
          </div>

          {/* CRM Connection & Data Analysis Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Sync Latency</span>
              <span className="text-base font-bold font-mono text-emerald-400">{company.pingMs} ms</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Real-time conduit</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Throughput</span>
              <span className="text-base font-bold font-mono text-sky-400">{company.eventsPerMin.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">events / min</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Authentication</span>
              <span className="text-xs font-semibold text-amber-300 block truncate" title={company.authType}>
                {company.authType.split('/')[0]}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Enterprise Token</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Sync Cycle</span>
              <span className="text-xs font-semibold text-purple-300 block truncate" title={company.syncFrequency}>
                {company.syncFrequency.split('/')[0]}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Bidirectional</span>
            </div>
          </div>

          {/* Supported Entities & Objects */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Synchronized Data Entities & CRM Objects</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {company.supportedObjects.map((obj, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700/60"
                >
                  {obj}
                </span>
              ))}
            </div>
          </div>

          {/* Protocols & Conduits */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supported Protocols & Integration Standards</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {company.protocols.map((proto, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-sky-950/60 text-sky-300 border border-sky-800/50"
                >
                  {proto}
                </span>
              ))}
            </div>
          </div>

          {/* Live Data Payload Inspection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sample Live Sync JSON Payload
              </h4>
              <button
                onClick={handleCopyPayload}
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#040817] border border-slate-800 font-mono text-xs text-sky-200/90 overflow-x-auto max-h-48 scrollbar-thin">
              {JSON.stringify(company.samplePayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#060c20] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onFocusIn3D && (
              <button
                onClick={() => {
                  onFocusIn3D(company);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
              >
                View in 3D Scene
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateSync}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                syncTriggered
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20'
              }`}
            >
              {syncTriggered ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Sync Dispatched to 3D Nexus!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Trigger Live 3D Data Pulse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
