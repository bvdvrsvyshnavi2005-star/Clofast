import React, { useState, useEffect, useRef } from 'react';
import { ThreeNexusScene, CameraPreset } from './three/ThreeNexusScene';
import { Navbar, ActiveTab } from './components/Navbar';
import { CollapsibleDock } from './components/CollapsibleDock';
import { CompanyDetailModal } from './components/CompanyDetailModal';
import { CrmDataAnalysisView } from './components/CrmDataAnalysisView';
import { CompanyDirectoryView } from './components/CompanyDirectoryView';
import { LivePipelineTesterView } from './components/LivePipelineTesterView';
import { OriginalImageModal } from './components/OriginalImageModal';
import { CompanyEntity, CategoryId } from './types/integration';
import { INTEGRATION_CATEGORIES } from './data/companies';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeNexusScene | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('3d');
  const [selectedCompany, setSelectedCompany] = useState<CompanyEntity | null>(null);
  const [hoveredEntityName, setHoveredEntityName] = useState<string | null>(null);
  const [currentCameraPreset, setCurrentCameraPreset] = useState<CameraPreset>('overview');
  const [explodedDist, setExplodedDist] = useState<number>(1.0);
  const [dataSpeed, setDataSpeed] = useState<number>(1.0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  // Initialize Three.js WebGL Scene inside stable container ref
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new ThreeNexusScene(mountRef.current, {
      onSelectCompany: (company) => {
        setSelectedCompany(company);
      },
      onSelectCategory: (catId) => {
        setCurrentCameraPreset(catId);
      },
      onHoverObject: (name) => {
        setHoveredEntityName(name);
      }
    });

    sceneRef.current = scene;

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  const handleSelectCameraPreset = (preset: CameraPreset) => {
    setCurrentCameraPreset(preset);
    if (sceneRef.current) {
      sceneRef.current.setCameraPreset(preset);
    }
  };

  const handleChangeExplodedDist = (val: number) => {
    setExplodedDist(val);
    if (sceneRef.current) {
      sceneRef.current.setExplodedDistance(val);
    }
  };

  const handleChangeDataSpeed = (val: number) => {
    setDataSpeed(val);
    if (sceneRef.current) {
      sceneRef.current.setDataSpeed(val);
    }
  };

  const handleToggleAutoRotate = () => {
    const nextState = !isAutoRotate;
    setIsAutoRotate(nextState);
    if (sceneRef.current) {
      sceneRef.current.toggleAutoRotate();
    }
  };

  const handleResetView = () => {
    setCurrentCameraPreset('overview');
    setExplodedDist(1.0);
    setDataSpeed(1.0);
    setIsAutoRotate(true);
    if (sceneRef.current) {
      sceneRef.current.resetView();
      sceneRef.current.setExplodedDistance(1.0);
      sceneRef.current.setDataSpeed(1.0);
    }
  };

  const handleTriggerSyncPulse = (sourceId: string, targetId: string) => {
    if (sceneRef.current) {
      sceneRef.current.triggerSyncPulse(sourceId, targetId);
    }
  };

  const handleFocusCompanyIn3D = (company: CompanyEntity) => {
    setActiveTab('3d');
    setCurrentCameraPreset(company.category);
    if (sceneRef.current) {
      sceneRef.current.setCameraPreset(company.category);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030714] text-slate-100 font-sans select-none">
      {/* 3D WebGL Canvas Layer (Always persistent in background) */}
      <div
        ref={mountRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          activeTab === '3d' ? 'opacity-100 pointer-events-auto' : 'opacity-20 pointer-events-none'
        }`}
      />

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenImageModal={() => setIsImageModalOpen(true)}
        hoveredEntityName={hoveredEntityName}
      />

      {/* 3D View Overlays (Only visible when 3D tab is active) */}
      {activeTab === '3d' && (
        <>
          {/* Top-Left Minimal Architecture Info Card */}
          <div className="fixed top-18 left-4 z-20 pointer-events-none">
            <div className="bg-[#070e24]/85 border border-slate-800/80 p-3 rounded-2xl shadow-xl pointer-events-auto max-w-xs space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-sky-400">
                <span>Clofast 3D Data Mesh</span>
                <span className="text-emerald-400">18 Nodes Active</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Click any orbiting satellite to inspect company schemas, or use bottom controls to pivot camera.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-400">
                <span>Drag: Orbit</span>
                <span>•</span>
                <span>Scroll: Zoom</span>
              </div>
            </div>
          </div>

          {/* Unified Collapsible Bottom Dock Controls */}
          <CollapsibleDock
            currentPreset={currentCameraPreset}
            onSelectPreset={handleSelectCameraPreset}
            explodedDist={explodedDist}
            onChangeExplodedDist={handleChangeExplodedDist}
            dataSpeed={dataSpeed}
            onChangeDataSpeed={handleChangeDataSpeed}
            isAutoRotate={isAutoRotate}
            onToggleAutoRotate={handleToggleAutoRotate}
            onResetView={handleResetView}
          />
        </>
      )}

      {/* Tab Pages (Rendered on top of subtle 3D background) */}
      {activeTab !== '3d' && (
        <div className="relative z-10 w-full h-full overflow-y-auto">
          {activeTab === 'crm-analysis' && (
            <CrmDataAnalysisView
              onSelectCompany={setSelectedCompany}
              onTriggerPulse={handleTriggerSyncPulse}
            />
          )}

          {activeTab === 'directory' && (
            <CompanyDirectoryView
              onSelectCompany={setSelectedCompany}
              onFocusIn3D={handleFocusCompanyIn3D}
              onTriggerSyncPulse={handleTriggerSyncPulse}
            />
          )}

          {activeTab === 'tester' && (
            <LivePipelineTesterView
              onTrigger3DPulse={handleTriggerSyncPulse}
              onNavigateTo3D={() => setActiveTab('3d')}
            />
          )}
        </div>
      )}

      {/* Company Detail Inspection Modal */}
      <CompanyDetailModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onTriggerSyncPulse={handleTriggerSyncPulse}
        onFocusIn3D={handleFocusCompanyIn3D}
      />

      {/* Original Image Specification Modal */}
      <OriginalImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
}
