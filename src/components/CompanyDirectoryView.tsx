import React, { useState } from 'react';
import { INTEGRATION_CATEGORIES } from '../data/companies';
import { CompanyEntity, CategoryId } from '../types/integration';
import { Search, ExternalLink, Zap, Compass, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

interface CompanyDirectoryViewProps {
  onSelectCompany: (company: CompanyEntity) => void;
  onFocusIn3D: (company: CompanyEntity) => void;
  onTriggerSyncPulse: (sourceId: string, targetId: string) => void;
}

export const CompanyDirectoryView: React.FC<CompanyDirectoryViewProps> = ({
  onSelectCompany,
  onFocusIn3D,
  onTriggerSyncPulse
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = INTEGRATION_CATEGORIES.map((cat) => {
    const matchingCompanies = cat.companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.protocols.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === 'all' || cat.id === selectedCategory;
      return matchesSearch && matchesCat;
    });

    return {
      ...cat,
      companies: matchingCompanies
    };
  }).filter((cat) => cat.companies.length > 0);

  return (
    <div className="pt-20 pb-28 px-4 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20">
              Verified Ecosystem
            </span>
            <span className="text-xs text-slate-400">Clofast Certified Enterprise Connectors</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Ecosystem Directory (18 Systems & Protocols)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete architectural profiles, authentication mechanisms, and CRM entity synchronization mappings.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search companies, protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all">All 6 Categories</option>
            <option value="crm">CRM & Marketing</option>
            <option value="erp">ERP Systems</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="payments">Payments</option>
            <option value="media">Media & Documents</option>
            <option value="data">Data & Integrations</option>
          </select>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-12">
        {filteredCategories.map((cat) => (
          <section key={cat.id} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <h2 className="text-xl font-bold text-white tracking-tight">{cat.title}</h2>
                <span className="text-xs text-slate-400 hidden sm:inline">— {cat.description}</span>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {cat.companies.length} Systems
              </span>
            </div>

            {/* 3-Col Company Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-[#070e24] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all group hover:-translate-y-1 duration-200"
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Initial Badge + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg border shadow-sm"
                          style={{
                            backgroundColor: company.color + '20',
                            borderColor: company.color + '45',
                            color: company.color
                          }}
                        >
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base group-hover:text-sky-300 transition-colors">
                            {company.name}
                          </h3>
                          <span className="text-[11px] text-slate-400 block line-clamp-1">
                            {company.tagline}
                          </span>
                        </div>
                      </div>

                      <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {company.pingMs}ms
                      </span>
                    </div>

                    {/* Rich Description */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {company.description}
                    </p>

                    {/* Supported Objects Pills */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Synchronized Entities:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {company.supportedObjects.slice(0, 4).map((obj, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[11px] bg-slate-900 text-slate-300 border border-slate-800"
                          >
                            {obj}
                          </span>
                        ))}
                        {company.supportedObjects.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                            +{company.supportedObjects.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Protocols */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Protocols:
                      </span>
                      <span className="text-[11px] font-mono text-sky-400 truncate">
                        {company.protocols.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectCompany(company)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Inspect Payload</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onFocusIn3D(company);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
                        title="View in 3D Scene"
                      >
                        <Compass className="w-3.5 h-3.5 text-sky-400" />
                      </button>

                      <button
                        onClick={() => onTriggerSyncPulse(company.id, 'core')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-all"
                        title="Fire 3D Pulse"
                      >
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Sync</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
