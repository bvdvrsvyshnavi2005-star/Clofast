export type CategoryId = 'crm' | 'erp' | 'ecommerce' | 'payments' | 'media' | 'data';

export interface CompanyEntity {
  id: string;
  name: string;
  category: CategoryId;
  categoryTitle: string;
  tagline: string;
  description: string;
  protocols: string[];
  syncFrequency: string;
  authType: string;
  supportedObjects: string[];
  color: string;
  accentColor: string;
  badgeBg: string;
  status: 'active' | 'syncing' | 'healthy';
  pingMs: number;
  eventsPerMin: number;
  samplePayload: Record<string, any>;
}

export interface CategoryGroup {
  id: CategoryId;
  title: string;
  color: string;
  description: string;
  iconName: string;
  companies: CompanyEntity[];
}

export interface SyncLogEvent {
  id: string;
  timestamp: string;
  source: string;
  target: string;
  category: CategoryId;
  recordType: string;
  recordId: string;
  status: 'success' | 'syncing' | 'warning';
  latencyMs: number;
  payloadSizeKb: number;
}

export interface PipelineMetric {
  metric: string;
  value: string;
  change: string;
  positive: boolean;
}
