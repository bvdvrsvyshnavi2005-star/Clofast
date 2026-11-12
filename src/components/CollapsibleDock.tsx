import React, { useState } from 'react';
import { Camera, Sliders, RotateCw, ChevronDown, ChevronUp, Eye, Zap, Layers } from 'lucide-react';
import { CameraPreset } from '../three/ThreeNexusScene';
import { CategoryId } from '../types/integration';

interface CollapsibleDockProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  explodedDist: number;
  onChangeExplodedDist: (val: number) => void;
  dataSpeed: number;
  onChangeDataSpeed: (val: number) => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetView: () => void;
}

export const CollapsibleDock: React.FC<CollapsibleDockProps> = ({
  currentPreset,
  onSelectPreset,
  explodedDist,
  onChangeExplodedDist,
  dataSpeed,
  onChangeDataSpeed,
  isAutoRotate,
  onToggleAutoRotate,
  onResetView
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const presets: { id: CameraPreset; label: string; dotColor: string }[] = [
    { id: 'overview', label: 'Overview', dotColor: 'bg-sky-400' },
    { id: 'core', label: 'Clofast Core', dotColor: 'bg-amber-400' },
    { id: 'crm', label: 'CRM & Marketing', dotColor: 'bg-orange-500' },
    { id: 'erp', label: 'ERP Systems', dotColor: 'bg-blue-500' },
    { id: 'ecommerce', label: 'E-Commerce', dotColor: 'bg-cyan-500' },
    { id: 'payments', label: 'Payments', dotColor: 'bg-emerald-500' },
    { id: 'media', label: 'Media & Docs', dotColor: 'bg-purple-500' },
    { id: 'data', label: 'Data & Integrations', dotColor: 'bg-teal-500' }
  ];

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 ease-out ${
        isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
      }`}
      style={{
        bottom: '20px',
        width: 'min(980px, 94vw)'
      }}
    >
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center -mb-[1px]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1 rounded-t-xl bg-[#09112a] border-t border-x border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-colors shadow-lg"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Show 3D Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Controls (Zen Mode)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container: solid/rgba surface (strictly avoiding backdrop-filter over WebGL) */}
      <div className="bg-[#070e24] border border-slate-700/90 rounded-2xl p-3.5 shadow-2xl shadow-black/80 space-y-3">
        {/* Preset Camera Views Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 pr-2 border-r border-slate-800 shrink-0">
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span>Target View:</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {presets.map((p) => {
              const active = currentPreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPreset(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/40 font-semibold'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.dotColor}`} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders and Scene Tweaks Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Exploded Radial Distance */}
          <div className="flex items-center gap-2.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-300 font-medium whitespace-nowrap">Explode Ring</span>
              <input
                type="range"
                min="0.8"
                max="1.7"
                step="0.05"
                value={explodedDist}
                onChange={(e) => onChangeExplodedDist(parseFloat(e.target.value))}
                className="w-24 accent-sky-400 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-sky-400 font-semibold w-8 text-right">
                {explodedDist.toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Sync Pulse Stream Velocity */}
          <div className="flex items-center gap-2.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-300 font-medium whitespace-nowrap">Stream Speed</span>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.1"
                value={dataSpeed}
                onChange={(e) => onChangeDataSpeed(parseFloat(e.target.value))}
                className="w-24 accent-amber-400 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-amber-400 font-semibold w-8 text-right">
                {dataSpeed.toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Action Buttons: Auto-Rotate & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleAutoRotate}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                isAutoRotate
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'text-emerald-400' : ''}`} />
              <span>{isAutoRotate ? 'Orbit: ON' : 'Orbit: OFF'}</span>
            </button>

            <button
              onClick={onResetView}
              className="py-1.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
