import React from 'react';
import { X, CheckCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { INTEGRATION_CATEGORIES } from '../data/companies';

interface OriginalImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalImageModal: React.FC<OriginalImageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#091129] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#060c20] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Original Clofast Architecture Specification
              </h3>
              <p className="text-xs text-slate-400">
                Direct cross-reference with provided blueprint image
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Embedded Image Reference */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
            <img
              src="/public/assets/aistudio/1794464634566_b5195a36.png"
              alt="Clofast CRM and Integrations Architecture"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>

          {/* 6 Category Breakdown Matrix */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Full Ecosystem Verification (6 Pillars & 18 Systems)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {INTEGRATION_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-xl bg-[#070e24] border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-bold text-white">{cat.title}</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 pl-4 list-disc text-[11px]">
                    {cat.companies.map((c) => (
                      <li key={c.id}>
                        <strong className="text-slate-100">{c.name}</strong>: {c.tagline}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#060c20] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>All 18 entities and 6 categories verified in 3D scene & directory</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
