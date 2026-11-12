import React from 'react';
import { Activity, Layers, Database, Compass, Play, Image as ImageIcon, Sparkles } from 'lucide-react';

export type ActiveTab = '3d' | 'crm-analysis' | 'directory' | 'tester';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenImageModal: () => void;
  hoveredEntityName: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenImageModal,
  hoveredEntityName
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#030712]/90 border-b border-slate-800/80 px-4 py-3 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onTabChange('3d')}>
            {/* Clofast Custom Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-amber-400 p-[2px] shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-[#070f26] rounded-[10px] flex items-center justify-center font-black text-sm text-white tracking-wider">
                <span className="text-sky-400">C</span>
                <span className="text-amber-400 font-bold -ml-0.5">F</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white tracking-tight">Clofast</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Nexus 3D
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Enterprise CRM & Data Integration Cloud
              </p>
            </div>
          </div>

          {/* Hover Status Readout in 3D Mode */}
          {hoveredEntityName && activeTab === '3d' && (
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-sky-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Targeting: <strong className="text-white">{hoveredEntityName}</strong></span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onTabChange('3d')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === '3d'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Nexus</span>
          </button>

          <button
            onClick={() => onTabChange('crm-analysis')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'crm-analysis'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>CRM & Analytics</span>
          </button>

          <button
            onClick={() => onTabChange('directory')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'directory'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>18 Integrations</span>
          </button>

          <button
            onClick={() => onTabChange('tester')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tester'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Live Sync Test</span>
          </button>
        </nav>

        {/* Right Action: Blueprint Reference Modal */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImageModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
            title="View original Clofast architecture graphic"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Source Graphic</span>
          </button>
        </div>
      </div>
    </header>
  );
};
