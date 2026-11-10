// EcoPonto Inteligente — Banco de Dados Relacional Local (src/db.ts)
// Simulado Programa Centelha 3 Rondônia - Edital 03/2026
// Dados Reais Integrados: SINIR+, Governo de Rondônia, SEMA Porto Velho, SEDAM, CATANORTE

import { User, Ecoponto, Despacho, MaterialInfo, Campanha } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-ana',
    name: 'Ana Beatriz de Lima Rosa',
    email: 'anabeatriz@escola.ro.gov.br',
    role: 'CIDADAO',
    points: 380,
    status: 'Ativo',
    location: '3°B Informática – EEEFM Carmela Dutra, Porto Velho - RO',
    document: '048.912.732-11',
    phone: '(69) 99312-4488',
    avatarInitial: 'A'
  },
  {
    id: 'user-catanorte',
    name: 'Cooperativa CATANORTE (Catadores de RO)',
    email: 'triagem@catanorte.org.br',
    role: 'COOPERATIVA',
    points: 1850,
    status: 'Ativo',
    location: 'Bairro Lagoa – Porto Velho / RO',
    document: '28.114.982/0001-44',
    phone: '(69) 98451-2299',
    avatarInitial: 'C'
  },
  {
    id: 'user-carmela',
    name: 'EEEFM Carmela Dutra (Direção Escolar)',
    email: 'direcao@carmeladutra.edu.ro.gov.br',
    role: 'ESCOLA',
    points: 950,
    status: 'Ativo',
    location: 'Bairro Panair – Porto Velho / RO',
    document: '04.221.849/0001-90',
    phone: '(69) 3216-5544',
    avatarInitial: 'E'
  },
  {
    id: 'user-sema',
    name: 'SEMA – Secretaria Municipal de Meio Ambiente',
    email: 'gestao@sema.portovelho.ro.gov.br',
    role: 'ADMIN',
    points: 0,
    status: 'Ativo',
    location: 'Bairro São Cristóvão / Centro – Porto Velho / RO',
    document: '05.903.125/0001-08',
    phone: '(69) 3901-3000',
    avatarInitial: 'S'
  }
];

export const INITIAL_MATERIALS: MaterialInfo[] = [
  {
    id: 'mat-plastico',
    name: 'Plásticos (PET, PEAD, PEBD, PP)',
    category: 'PLASTICO',
    pricePerKg: 2.40,
    co2Factor: 1.53,
    conamaColor: '#DC2626', // Vermelho CONAMA
    conamaName: 'COLETA CONAMA • PLÁSTICO',
    description: 'Garrafas PET de refrigerante/água, embalagens de xampu, potes de margarina, baldes e sacolas limpas.',
    howToPrepare: 'Enxágue com água de reúso para retirar restos de matéria orgânica. Deixe secar, amasse a garrafa para retirar o ar e rosqueie a tampa.'
  },
  {
    id: 'mat-papel',
    name: 'Papel, Papelão e Embalagens Longa Vida',
    category: 'PAPEL',
    pricePerKg: 0.65,
    co2Factor: 0.92,
    conamaColor: '#2563EB', // Azul CONAMA
    conamaName: 'COLETA CONAMA • PAPEL',
    description: 'Caixas de papelão ondulado desmontadas, folhas de papel A4/caderno, livros desincorporados e jornais.',
    howToPrepare: 'Desmonte e achate as caixas de papelão para otimizar espaço de carga. Mantenha os papéis em local seco; papel molhado perde valor de comercialização.'
  },
  {
    id: 'mat-vidro',
    name: 'Vidros (Garrafas, Potes de Conserva e Frascos)',
    category: 'VIDRO',
    pricePerKg: 0.35,
    co2Factor: 0.31,
    conamaColor: '#16A34A', // Verde CONAMA
    conamaName: 'COLETA CONAMA • VIDRO',
    description: 'Garrafas de cerveja, refrigerante, sucos, potes de molho, conserva de palmito e frascos de café.',
    howToPrepare: 'Esvazie e enxágue bem. Remova tampas metálicas ou plásticas. Em caso de quebra, embale em caixa de papelão identificada com a palavra "VIDRO QUEBRADO" para proteger os catadores de acidentes cortantes.'
  },
  {
    id: 'mat-metal',
    name: 'Metais e Alumínio (Latinhas e Sucatas Nobres)',
    category: 'METAL',
    pricePerKg: 6.80,
    co2Factor: 9.13,
    conamaColor: '#CA8A04', // Amarelo CONAMA
    conamaName: 'COLETA CONAMA • METAL',
    description: 'Latinhas de bebidas de alumínio, tampinhas de garrafa, arames, latas de leite em pó e conservas.',
    howToPrepare: 'Esvazie resíduos líquidos. Amasse as latinhas para compactação cúbica. O alumínio é 100% reciclável com índice recorde de 98,7% no Brasil, economizando até 95% de energia elétrica.'
  },
  {
    id: 'mat-eletronico',
    name: 'Resíduos Eletroeletrônicos (E-Lixo / Logística Reversa)',
    category: 'ELETRONICO',
    pricePerKg: 4.80,
    co2Factor: 4.80,
    conamaColor: '#EA580C', // Laranja
    conamaName: 'COLETA CONAMA • ELETRÔNICOS',
    description: 'Pilhas, baterias, celulares antigos, cabos, placas-mãe, monitores danificados e periféricos de informática.',
    howToPrepare: 'Nunca rompa nem perfure pilhas ou baterias. Acondicione equipamentos em recipientes plásticos secos e destine ao PEV do Palácio Rio Madeira (SEDAM) para neutralização de metais pesados.'
  },
  {
    id: 'mat-oleo',
    name: 'Óleo Vegetal de Fritura Usado',
    category: 'OLEO',
    pricePerKg: 2.45,
    co2Factor: 2.45,
    conamaColor: '#D97706', // Âmbar
    conamaName: 'COLETA CONAMA • ÓLEO',
    description: 'Óleo de cozinha usado pós-fritura doméstica ou comercial.',
    howToPrepare: 'Espere esfriar completamente. Filtre com funil e gaze para remover farelos e armazene em garrafas PET transparentes bem vedadas. Evita a contaminação de até 25 mil litros de água por litro de óleo despejado no Rio Madeira.'
  }
];

export const INITIAL_ECOPONTOS: Ecoponto[] = [
  {
    id: 'eco-sema',
    name: 'SEMA – Secretaria Municipal de Meio Ambiente de Porto Velho',
    category: 'Ecoponto Municipal',
    address: 'Rua Duque de Caxias, 186 – Bairro São Cristóvão — São Cristóvão / Centro, Porto Velho - RO',
    municipio: 'Porto Velho',
    lat: -8.7595,
    long: -63.9012,
    capacityKg: 3000,
    currentKg: 1440,
    iotPercent: 48,
    status: 'Ativo',
    materialsAccepted: ['Plásticos', 'Papel, Papelão', 'Vidros', 'Metais'],
    contact: '(69) 3901-3000',
    userDeliveriesCount: 1
  },
  {
    id: 'eco-catanorte',
    name: 'CATANORTE – Cooperativa de Catadores de Materiais Recicláveis',
    category: 'Cooperativa de Catadores',
    address: 'Rua da Beira, 4520 – Bairro Lagoa (próximo à BR-364) • Lagoa, Porto Velho - RO',
    municipio: 'Porto Velho',
    lat: -8.7750,
    long: -63.8820,
    capacityKg: 10000,
    currentKg: 7400,
    iotPercent: 74,
    status: 'Ativo',
    materialsAccepted: ['Plásticos', 'Papel, Papelão', 'Vidros', 'Metais', 'Óleo'],
    contact: '(69) 98451-2299',
    userDeliveriesCount: 1
  },
  {
    id: 'eco-carmela',
    name: 'EEEFM Carmela Dutra (Ponto Escolar Sustentável)',
    category: 'Ponto Escolar',
    address: 'Av. Farquar, 2550 – Bairro Panair (CEP 76801-329) • Panair, Porto Velho - RO',
    municipio: 'Porto Velho',
    lat: -8.7512,
    long: -63.9085,
    capacityKg: 1200,
    currentKg: 456,
    iotPercent: 38,
    status: 'Ativo',
    materialsAccepted: ['Plásticos', 'Papel, Papelão', 'Metais'],
    contact: '(69) 3216-5544',
    userDeliveriesCount: 1
  },
  {
    id: 'eco-sedam',
    name: 'SEDAM – Palácio Rio Madeira (PEV de Resíduos Eletrônicos)',
    category: 'Ponto Governamental',
    address: 'Av. Farquar, 2986 – Bairro Pedrinhas • Porto Velho - RO',
    municipio: 'Porto Velho',
    lat: -8.7485,
    long: -63.9050,
    capacityKg: 2000,
    currentKg: 1320,
    iotPercent: 66,
    status: 'Ativo',
    materialsAccepted: ['Resíduos Eletroeletrônicos', 'Pilhas e Baterias'],
    contact: '(69) 3212-9600',
    userDeliveriesCount: 1
  },
  {
    id: 'eco-asprevel',
    name: 'ASPREVEL – Assoc. de Produtores de Recicláveis de Porto Velho',
    category: 'Cooperativa de Catadores',
    address: 'Av. dos Imigrantes, 4100 – Bairro São Sebastião • Porto Velho - RO',
    municipio: 'Porto Velho',
    lat: -8.7420,
    long: -63.8710,
    capacityKg: 5000,
    currentKg: 2650,
    iotPercent: 53,
    status: 'Ativo',
    materialsAccepted: ['Plásticos', 'Papel, Papelão', 'Vidros', 'Metais'],
    contact: '(69) 99233-1188',
    userDeliveriesCount: 0
  },
  {
    id: 'eco-jiparana',
    name: 'SEMAM Ji-Paraná (Ecoponto Central do Interior)',
    category: 'Ecoponto Municipal',
    address: 'Av. Marechal Rondon, 890 – Centro • Ji-Paraná - RO',
    municipio: 'Ji-Paraná',
    lat: -10.8828,
    long: -61.9458,
    capacityKg: 4000,
    currentKg: 1880,
    iotPercent: 47,
    status: 'Ativo',
    materialsAccepted: ['Plásticos', 'Papel, Papelão', 'Metais', 'Vidros'],
    contact: '(69) 3416-4000',
    userDeliveriesCount: 0
  }
];

export const INITIAL_DESPACHOS: Despacho[] = [
  {
    id: 'ECO-RO-2026-001',
    timestamp: '2026-10-10 10:20',
    userId: 'user-ana',
    userName: 'Ana Beatriz de Lima Rosa',
    ecopontoId: 'eco-carmela',
    ecopontoName: 'EEEFM Carmela Dutra (Ponto Escolar Sustentável)',
    materialName: 'Plásticos (PET, PEAD, PEBD, PP)',
    category: 'PLASTICO',
    weightKg: 8.5,
    co2AvoidedKg: 13.00,
    pointsEarned: 85,
    estimatedRevenue: 20.40,
    status: 'VALIDADO NO ECOPONTO',
    notes: 'Garrafas PET higienizadas e amassadas da cantina escolar.',
    hashAudit: 'a9f24c8b7e1903e1'
  },
  {
    id: 'ECO-RO-2026-002',
    timestamp: '2026-10-11 14:15',
    userId: 'user-ana',
    userName: 'Ana Beatriz de Lima Rosa',
    ecopontoId: 'eco-sema',
    ecopontoName: 'SEMA – Secretaria Municipal de Meio Ambiente de Porto Velho',
    materialName: 'Papel, Papelão e Embalagens Longa Vida',
    category: 'PAPEL',
    weightKg: 14.0,
    co2AvoidedKg: 12.88,
    pointsEarned: 140,
    estimatedRevenue: 9.10,
    status: 'VALIDADO NO ECOPONTO',
    notes: 'Caixas de papelão desmontadas de apostilas e provas desincorporadas.',
    hashAudit: 'bc435df1782a99e2'
  },
  {
    id: 'ECO-RO-2026-003',
    timestamp: '2026-10-12 16:40',
    userId: 'user-ana',
    userName: 'Ana Beatriz de Lima Rosa',
    ecopontoId: 'eco-sedam',
    ecopontoName: 'SEDAM – Palácio Rio Madeira (PEV de Resíduos Eletrônicos)',
    materialName: 'Resíduos Eletroeletrônicos (E-Lixo / Logística Reversa)',
    category: 'ELETRONICO',
    weightKg: 3.2,
    co2AvoidedKg: 15.36,
    pointsEarned: 95,
    estimatedRevenue: 15.36,
    status: 'VALIDADO NO ECOPONTO',
    notes: 'Fontes queimadas e memórias de laboratório técnico de informática.',
    hashAudit: 'cd789e0123fa44e3'
  },
  {
    id: 'ECO-RO-2026-004',
    timestamp: '2026-10-12 17:10',
    userId: 'user-catanorte',
    userName: 'Cooperativa CATANORTE (Catadores de RO)',
    ecopontoId: 'eco-catanorte',
    ecopontoName: 'CATANORTE – Cooperativa de Catadores de Materiais Recicláveis',
    materialName: 'Metais e Alumínio (Latinhas e Sucatas Nobres)',
    category: 'METAL',
    weightKg: 32.5,
    co2AvoidedKg: 296.72,
    pointsEarned: 325,
    estimatedRevenue: 221.00,
    status: 'VALIDADO NO ECOPONTO',
    notes: 'Lote consolidado de latinhas de alumínio prensadas em fardos.',
    hashAudit: 'de998101ab4321e4'
  },
  {
    id: 'ECO-RO-2026-005',
    timestamp: '2026-10-13 11:30',
    userId: 'user-ana',
    userName: 'Ana Beatriz de Lima Rosa',
    ecopontoId: 'eco-catanorte',
    ecopontoName: 'CATANORTE – Cooperativa de Catadores de Materiais Recicláveis',
    materialName: 'Óleo Vegetal de Fritura Usado',
    category: 'OLEO',
    weightKg: 6.0,
    co2AvoidedKg: 14.70,
    pointsEarned: 60,
    estimatedRevenue: 14.70,
    status: 'VALIDADO NO ECOPONTO',
    notes: '3 garrafas PET de 2L de óleo filtrado coletado com vizinhos.',
    hashAudit: 'ef012234bc5432e5'
  }
];

export const INITIAL_CAMPANHAS: Campanha[] = [
  {
    id: 'camp-carmela',
    title: 'Gincana Escolar 3°B Informática: Rondônia Sustentável',
    entity: 'EEEFM Carmela Dutra & Turma 3°B',
    description: 'Mobilização pedagógica dos estudantes do curso técnico em informática com destinação direta para a cooperativa CATANORTE.',
    currentKg: 384,
    targetKg: 500,
    progressPercent: 77,
    status: 'EM ANDAMENTO'
  },
  {
    id: 'camp-oleo',
    title: 'Campanha Óleo no Rio Nunca Mais: Protegendo o Rio Madeira',
    entity: 'Condomínios de Porto Velho & SEMA',
    description: 'Coleta voluntária de óleo de cozinha usado em garrafas PET para impedir a contaminação da bacia do Rio Madeira e converter em sabão ecológico.',
    currentKg: 215,
    targetKg: 300,
    progressPercent: 72,
    status: 'EM ANDAMENTO'
  },
  {
    id: 'camp-sedam',
    title: 'Mutirão Estadual de E-Lixo: Logística Reversa SEDAM-RO',
    entity: 'Governo de Rondônia / Simulado Centelha 3',
    description: 'Coleta de pilhas, celulares e equipamentos eletrônicos para reciclagem tecnológica e neutralização de metais pesados.',
    currentKg: 640,
    targetKg: 1200,
    progressPercent: 53,
    status: 'EM ANDAMENTO'
  }
];

// Helper functions for storage management
const STORAGE_KEYS = {
  USERS: 'ecoponto_users',
  ECOPONTOS: 'ecoponto_ecopontos',
  DESPACHOS: 'ecoponto_despachos',
  MATERIALS: 'ecoponto_materials',
  CAMPANHAS: 'ecoponto_campanhas',
  CURRENT_USER: 'ecoponto_current_user'
};

export class EcoPontoDB {
  static getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getEcopontos(): Ecoponto[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ECOPONTOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ECOPONTOS, JSON.stringify(INITIAL_ECOPONTOS));
      return INITIAL_ECOPONTOS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ECOPONTOS;
    }
  }

  static saveEcopontos(ecopontos: Ecoponto[]): void {
    localStorage.setItem(STORAGE_KEYS.ECOPONTOS, JSON.stringify(ecopontos));
  }

  static getDespachos(): Despacho[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DESPACHOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DESPACHOS, JSON.stringify(INITIAL_DESPACHOS));
      return INITIAL_DESPACHOS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DESPACHOS;
    }
  }

  static saveDespachos(despachos: Despacho[]): void {
    localStorage.setItem(STORAGE_KEYS.DESPACHOS, JSON.stringify(despachos));
  }

  static getMaterials(): MaterialInfo[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(INITIAL_MATERIALS));
      return INITIAL_MATERIALS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MATERIALS;
    }
  }

  static saveMaterials(materials: MaterialInfo[]): void {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }

  static getCampanhas(): Campanha[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPANHAS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CAMPANHAS, JSON.stringify(INITIAL_CAMPANHAS));
      return INITIAL_CAMPANHAS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CAMPANHAS;
    }
  }

  static getCurrentUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      const defaultUser = INITIAL_USERS[0]; // Ana Beatriz
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS[0];
    }
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static resetDatabase(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.ECOPONTOS, JSON.stringify(INITIAL_ECOPONTOS));
    localStorage.setItem(STORAGE_KEYS.DESPACHOS, JSON.stringify(INITIAL_DESPACHOS));
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(INITIAL_MATERIALS));
    localStorage.setItem(STORAGE_KEYS.CAMPANHAS, JSON.stringify(INITIAL_CAMPANHAS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  }

  static exportBackupJSON(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      project: 'EcoPonto Inteligente — Simulado Centelha 3 Rondônia',
      author: 'Ana Beatriz de Lima Rosa',
      users: this.getUsers(),
      ecopontos: this.getEcopontos(),
      despachos: this.getDespachos(),
      materials: this.getMaterials(),
      campanhas: this.getCampanhas()
    };
    return JSON.stringify(data, null, 2);
  }

  static exportAuditCSV(): string {
    const despachos = this.getDespachos();
    const headers = [
      'CÓDIGO',
      'DATA/HORA',
      'CIDADÃO/ENTIDADE',
      'ECOPONTO',
      'MATERIAL',
      'PESO_KG',
      'CO2_EVITADO_KG',
      'PONTOS',
      'RENDA_GERADA_RS',
      'STATUS'
    ];

    const rows = despachos.map(d => [
      `"${d.id}"`,
      `"${d.timestamp}"`,
      `"${d.userName}"`,
      `"${d.ecopontoName}"`,
      `"${d.materialName}"`,
      d.weightKg.toFixed(1),
      d.co2AvoidedKg.toFixed(2),
      d.pointsEarned,
      d.estimatedRevenue.toFixed(2),
      `"${d.status}"`
    ]);

    return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  }
}
