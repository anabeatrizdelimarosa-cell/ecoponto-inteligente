// EcoPonto Inteligente — Definições de Tipos TypeScript (src/types.ts)
// Simulado Centelha 3 Rondônia - Edital 03/2026

export type UserRole = 'CIDADAO' | 'COOPERATIVA' | 'ESCOLA' | 'ADMIN';
export type UserStatus = 'Ativo' | 'Bloqueado';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  status: UserStatus;
  location: string;
  document: string; // CPF ou CNPJ
  phone?: string;
  avatarInitial?: string;
}

export type MaterialCategory = 'PLASTICO' | 'PAPEL' | 'VIDRO' | 'METAL' | 'ELETRONICO' | 'OLEO';

export interface MaterialInfo {
  id: string;
  name: string;
  category: MaterialCategory;
  pricePerKg: number; // R$/kg pago ao catador
  co2Factor: number; // kg CO2e evitado por kg reciclado
  conamaColor: string; // Padrão CONAMA
  conamaName: string;
  description: string;
  howToPrepare: string;
}

export interface Ecoponto {
  id: string;
  name: string;
  category: 'Ecoponto Municipal' | 'Cooperativa de Catadores' | 'Ponto Escolar' | 'Ponto Governamental';
  address: string;
  municipio: string;
  lat: number;
  long: number;
  capacityKg: number;
  currentKg: number;
  iotPercent: number; // 0 - 100% dos sensores ultrassônicos
  status: 'Ativo' | 'Manutenção' | 'Lotado';
  materialsAccepted: string[];
  contact?: string;
  userDeliveriesCount?: number;
}

export interface Despacho {
  id: string; // Código de rastreabilidade (ex: ECO-RO-2026-001)
  timestamp: string; // Data e hora ISO ou legível
  userId: string;
  userName: string;
  ecopontoId: string;
  ecopontoName: string;
  materialName: string;
  category: MaterialCategory;
  weightKg: number;
  co2AvoidedKg: number;
  pointsEarned: number;
  estimatedRevenue: number; // Renda gerada para catador (R$)
  status: 'VALIDADO NO ECOPONTO' | 'EM TRIAGEM' | 'CANCELADO';
  notes?: string;
  hashAudit?: string;
}

export interface Campanha {
  id: string;
  title: string;
  entity: string;
  description: string;
  currentKg: number;
  targetKg: number;
  progressPercent: number;
  status: 'EM ANDAMENTO' | 'CONCLUÍDA';
}

export interface StateMetrics {
  totalCollectedKg: number;
  userCollectedKg: number;
  userCo2AvoidedKg: number;
  userPoints: number;
  globalDeficitPercent: number; // 57,7% em RO
  activePointsCount: number;
}
