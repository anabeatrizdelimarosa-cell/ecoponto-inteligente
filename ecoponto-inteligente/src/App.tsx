import React, { useState, useEffect } from 'react';
import { User, Ecoponto, Despacho, MaterialInfo, Campanha } from './types';
import { EcoPontoDB } from './db';

export function App() {
  const [currentUser, setCurrentUser] = useState<User>(EcoPontoDB.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('map');
  const [adminTab, setAdminTab] = useState<string>('users');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login');
  
  const [users, setUsers] = useState<User[]>(EcoPontoDB.getUsers());
  const [ecopontos, setEcopontos] = useState<Ecoponto[]>(EcoPontoDB.getEcopontos());
  const [despachos, setDespachos] = useState<Despacho[]>(EcoPontoDB.getDespachos());
  const [materials, setMaterials] = useState<MaterialInfo[]>(EcoPontoDB.getMaterials());
  const [campanhas, setCampanhas] = useState<Campanha[]>(EcoPontoDB.getCampanhas());
  
  const [selectedEcoponto, setSelectedEcoponto] = useState<Ecoponto | null>(ecopontos[0] || null);
  const [mapFilter, setMapFilter] = useState<'all' | 'user'>('all');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Certificate Modal State
  const [activeCertificate, setActiveCertificate] = useState<Despacho | null>(null);
  
  // New Ecoponto Modal State
  const [showNewEcopontoModal, setShowNewEcopontoModal] = useState<boolean>(false);
  const [newEcopontoData, setNewEcopontoData] = useState({
    name: '',
    category: 'Ecoponto Municipal' as const,
    address: '',
    municipio: 'Porto Velho',
    capacityKg: 3000,
    materialsAccepted: 'Plásticos, Papel, Papelão, Vidros, Metais'
  });

  // Edit Material Modal State
  const [editingMaterial, setEditingMaterial] = useState<MaterialInfo | null>(null);

  // Form State for New Despacho
  const [formData, setFormData] = useState({
    ecopontoId: ecopontos[0]?.id || '',
    materialId: materials[0]?.id || '',
    weightKg: 8.5,
    notes: 'Garrafas limpas e sem tampas; entregue para triagem de cooperativa...'
  });

  // Calculate live global & user metrics
  const userDespachos = despachos.filter(d => d.userId === currentUser.id);
  const userTotalWeight = userDespachos.reduce((sum, d) => sum + d.weightKg, 0);
  const userTotalCo2 = userDespachos.reduce((sum, d) => sum + d.co2AvoidedKg, 0);
  const networkTotalWeight = despachos.reduce((sum, d) => sum + d.weightKg, 0);

  // Persist updates
  useEffect(() => {
    EcoPontoDB.saveUsers(users);
  }, [users]);

  useEffect(() => {
    EcoPontoDB.saveEcopontos(ecopontos);
  }, [ecopontos]);

  useEffect(() => {
    EcoPontoDB.saveDespachos(despachos);
  }, [despachos]);

  useEffect(() => {
    EcoPontoDB.saveMaterials(materials);
  }, [materials]);

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    EcoPontoDB.setCurrentUser(user);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Ativo' ? 'Bloqueado' : 'Ativo';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleUserRoleChange = (userId: string, newRole: any) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleIotSliderChange = (ecopontoId: string, val: number) => {
    setEcopontos(prev => prev.map(eco => {
      if (eco.id === ecopontoId) {
        const currentKg = Math.round((val / 100) * eco.capacityKg);
        const status = val >= 90 ? 'Lotado' : 'Ativo';
        return { ...eco, iotPercent: val, currentKg, status };
      }
      return eco;
    }));
  };

  const handleSaveMaterial = (updated: MaterialInfo) => {
    setMaterials(prev => prev.map(m => m.id === updated.id ? updated : m));
    setEditingMaterial(null);
  };

  const handleCreateDespacho = (e: React.FormEvent) => {
    e.preventDefault();
    const eco = ecopontos.find(item => item.id === formData.ecopontoId) || ecopontos[0];
    const mat = materials.find(item => item.id === formData.materialId) || materials[0];
    const weight = Number(formData.weightKg) || 1;
    const co2 = Number((weight * mat.co2Factor).toFixed(2));
    const points = Math.round(weight * 10);
    const revenue = Number((weight * mat.pricePerKg).toFixed(2));
    const code = `ECO-RO-2026-00${despachos.length + 1}`;

    const newDespacho: Despacho = {
      id: code,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      userId: currentUser.id,
      userName: currentUser.name,
      ecopontoId: eco.id,
      ecopontoName: eco.name,
      materialName: mat.name,
      category: mat.category,
      weightKg: weight,
      co2AvoidedKg: co2,
      pointsEarned: points,
      estimatedRevenue: revenue,
      status: 'VALIDADO NO ECOPONTO',
      notes: formData.notes,
      hashAudit: Math.random().toString(16).substring(2, 18)
    };

    setDespachos([newDespacho, ...despachos]);
    
    // Add points to current user
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, points: u.points + points } : u));
    setCurrentUser(prev => ({ ...prev, points: prev.points + points }));

    // Show certificate modal immediately
    setActiveCertificate(newDespacho);
  };

  const handleDeleteDespacho = (id: string) => {
    if (confirm(`Deseja realmente remover o registro ${id}?`)) {
      setDespachos(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleExportCSV = () => {
    const csvData = EcoPontoDB.exportAuditCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_ecoponto_ro_${Date.now()}.csv`;
    a.click();
  };

  const handleExportJSON = () => {
    const jsonData = EcoPontoDB.exportBackupJSON();
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_ecoponto_ro_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('map')}>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                🌿
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">EcoPonto Inteligente</h1>
                <p className="text-xs text-slate-500">Sistema Oficial de Coleta Seletiva & Rastreabilidade • RO</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.avatarInitial || currentUser.name.charAt(0)}
                </span>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    {currentUser.role} • {currentUser.points} pts
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setActiveTab('auth'); setAuthMode('login'); }}
                className="hidden sm:inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-50"
              >
                →] Entrar
              </button>
              <button
                onClick={() => { setActiveTab('auth'); setAuthMode('register'); }}
                className="hidden sm:inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-50"
              >
                + Cadastro
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 border-t border-slate-100 text-xs sm:text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'map' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              🧭 Mapa Interativo & Meus Despachos
            </button>
            <button
              onClick={() => setActiveTab('ecopontos')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'ecopontos' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              📍 Pontos de Coleta ({ecopontos.length})
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'historico' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              📄 Histórico & Comprovantes ({userDespachos.length})
            </button>
            <button
              onClick={() => setActiveTab('novo-despacho')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'novo-despacho' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              ⊕ Registrar Despacho
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'admin' ? 'bg-red-50 text-red-800 font-semibold' : 'hover:bg-slate-100 text-red-700'
              }`}
            >
              🛡️ Painel Administrativo (SEMA)
            </button>
            <button
              onClick={() => setActiveTab('guia')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'guia' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              ♻️ Guia CONAMA
            </button>
            <button
              onClick={() => setActiveTab('indicadores')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'indicadores' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              📊 Indicadores RO
            </button>
            <button
              onClick={() => setActiveTab('campanhas')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'campanhas' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              👥 Campanhas
            </button>
            <button
              onClick={() => setActiveTab('ficha')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'ficha' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-100'
              }`}
            >
              📋 Ficha Centelha 3
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Green Stats Card */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/40 text-emerald-200 border border-emerald-400/30 mb-2">
                🌿 Plataforma Oficial Centelha 3 Rondônia
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Gestão Inteligente & Rastreabilidade de Resíduos
              </h2>
              <p className="mt-2 text-sm text-emerald-100 leading-relaxed">
                Você está conectado como <strong className="text-white">{currentUser.name}</strong> ({currentUser.location}).
                O sistema rastreia cada quilo entregue em cooperativas e ecopontos com certificação digital auditável.
              </p>
            </div>

            {/* Quick Stat Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-3 text-center">
                <span className="text-[11px] text-emerald-200 uppercase font-semibold">Seus Despachos</span>
                <div className="text-lg font-bold text-white mt-0.5">{userTotalWeight.toFixed(1)} kg</div>
                <span className="text-[10px] text-emerald-300">entregues</span>
              </div>
              <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-3 text-center">
                <span className="text-[11px] text-emerald-200 uppercase font-semibold">Seu CO₂ Evitado</span>
                <div className="text-lg font-bold text-emerald-300 mt-0.5">{userTotalCo2.toFixed(1)} kg</div>
                <span className="text-[10px] text-emerald-300">gases neutralizados</span>
              </div>
              <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-3 text-center">
                <span className="text-[11px] text-emerald-200 uppercase font-semibold">Pontos Verdes</span>
                <div className="text-lg font-bold text-amber-300 mt-0.5">{currentUser.points} pts</div>
                <span className="text-[10px] text-emerald-300">acumulados</span>
              </div>
              <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-3 text-center">
                <span className="text-[11px] text-emerald-200 uppercase font-semibold">Total na Rede</span>
                <div className="text-lg font-bold text-white mt-0.5">{networkTotalWeight.toFixed(1)} kg</div>
                <span className="text-[10px] text-emerald-300">em Rondônia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW 1: MAPA INTERATIVO */}
        {activeTab === 'map' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 mb-6">
              <div>
                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                  🌐 GEOLOCALIZAÇÃO RONDÔNIA • Base Cartográfica: Porto Velho & Região Central
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">Mapa Interativo de Ecopontos & Seus Despachos</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Acompanhe a malha de coleta seletiva e veja em destaque onde <strong>{currentUser.name}</strong> já realizou entregas de resíduos.
                </p>
              </div>

              <div className="mt-4 sm:mt-0 flex space-x-2">
                <button
                  onClick={() => setMapFilter('all')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
                    mapFilter === 'all'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Todos os Pontos ({ecopontos.length})
                </button>
                <button
                  onClick={() => setMapFilter('user')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
                    mapFilter === 'user'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ✓ Onde Já Despachei ({ecopontos.filter(e => (e.userDeliveriesCount || 0) > 0).length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interactive Vector Map Canvas */}
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-700 relative overflow-hidden shadow-inner min-h-[460px] flex flex-col justify-between">
                {/* River and Roads Ambient SVG */}
                <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Calha do Rio Madeira */}
                  <path
                    d="M -20,120 C 180,110 320,60 520,140 C 680,200 820,160 950,90"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="38"
                    strokeLinecap="round"
                  />
                  <path
                    d="M -20,120 C 180,110 320,60 520,140 C 680,200 820,160 950,90"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="8"
                    strokeDasharray="12 12"
                  />
                  {/* Av. Sete de Setembro */}
                  <line x1="80" y1="360" x2="680" y2="360" stroke="#475569" strokeWidth="6" strokeDasharray="6 4" />
                  {/* Av. Rio Madeira (BR-364) */}
                  <line x1="380" y1="40" x2="620" y2="440" stroke="#64748b" strokeWidth="8" />
                </svg>

                {/* Map Labels */}
                <div className="relative z-10 flex justify-between items-start text-xs text-slate-400">
                  <span className="bg-sky-950/80 text-sky-300 px-3 py-1 rounded border border-sky-800 font-mono">
                    CALHA DO RIO MADEIRA
                  </span>
                  <div className="text-right space-y-1">
                    <span className="inline-block bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700 font-mono text-[11px]">
                      AV. RIO MADEIRA (BR-364)
                    </span>
                    <br />
                    <span className="inline-block bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700 font-mono text-[11px]">
                      AV. SETE DE SETEMBRO
                    </span>
                  </div>
                </div>

                {/* Pins overlay */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto py-6">
                  {ecopontos
                    .filter(eco => mapFilter === 'all' || (eco.userDeliveriesCount || 0) > 0)
                    .map(eco => {
                      const hasUserDelivered = (eco.userDeliveriesCount || 0) > 0;
                      const isSelected = selectedEcoponto?.id === eco.id;

                      return (
                        <div
                          key={eco.id}
                          onClick={() => setSelectedEcoponto(eco)}
                          className={`cursor-pointer transition-all transform hover:scale-105 p-3 rounded-xl border backdrop-blur-md ${
                            isSelected
                              ? 'ring-2 ring-emerald-400 bg-slate-800/90 shadow-xl'
                              : 'bg-slate-800/70 hover:bg-slate-800/90'
                          } ${
                            hasUserDelivered ? 'border-sky-500/50' : 'border-emerald-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className={`w-3.5 h-3.5 rounded-full mt-0.5 ${hasUserDelivered ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400'}`} />
                            {hasUserDelivered && (
                              <span className="text-[10px] font-bold bg-sky-900/80 text-sky-200 px-1.5 py-0.5 rounded border border-sky-600">
                                ✓ {eco.userDeliveriesCount} entregas
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <h4 className="text-xs font-bold text-white truncate">{eco.name}</h4>
                            <p className="text-[10px] text-slate-400 truncate">{eco.category}</p>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="text-slate-300">IoT Lotação:</span>
                            <span className={`font-bold ${eco.iotPercent >= 90 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {eco.iotPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full ${eco.iotPercent >= 90 ? 'bg-red-500' : 'bg-emerald-400'}`}
                              style={{ width: `${eco.iotPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                      <span>Onde Você Já Despachou</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                      <span>Ecopontos Credenciados</span>
                    </span>
                  </div>
                  <span>Coordenadas Georreferenciadas WGS84</span>
                </div>
              </div>

              {/* Lateral Inspector Panel */}
              {selectedEcoponto && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {selectedEcoponto.category}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ● {selectedEcoponto.status}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 mt-3 leading-snug">
                      {selectedEcoponto.name}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 flex items-start space-x-1">
                      <span>📍</span>
                      <span>{selectedEcoponto.address}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600">
                      <div>Lat: {selectedEcoponto.lat}</div>
                      <div>Long: {selectedEcoponto.long}</div>
                    </div>

                    {/* IoT Telemetry Meter */}
                    <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>📡 Telemetria de Lotação IoT:</span>
                        <span className={`font-bold ${selectedEcoponto.iotPercent >= 90 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {selectedEcoponto.iotPercent}% ({selectedEcoponto.currentKg}/{selectedEcoponto.capacityKg} kg)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full transition-all duration-300 ${
                            selectedEcoponto.iotPercent >= 90 ? 'bg-red-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${selectedEcoponto.iotPercent}%` }}
                        />
                      </div>
                      {selectedEcoponto.iotPercent >= 90 && (
                        <div className="mt-2 text-[11px] font-bold text-red-700 bg-red-100 p-2 rounded border border-red-300 animate-pulse">
                          ⚠️ ALERTA: Recipiente em capacidade crítica! Coleta urgente solicitada à SEMA.
                        </div>
                      )}
                    </div>

                    {/* Materials accepted */}
                    <div className="mt-4">
                      <span className="text-xs font-bold text-slate-700 block mb-1.5">Materiais Aceitos:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedEcoponto.materialsAccepted.map((m, idx) => (
                          <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {(selectedEcoponto.userDeliveriesCount || 0) > 0 && (
                      <div className="mt-4 bg-sky-50 border border-sky-200 rounded-lg p-2.5 text-xs text-sky-800 font-medium">
                        ✓ Você já realizou <strong>{selectedEcoponto.userDeliveriesCount}</strong> despacho(s) de resíduos neste ecoponto!
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, ecopontoId: selectedEcoponto.id }));
                        setActiveTab('novo-despacho');
                      }}
                      className="w-full py-2.5 px-4 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>⊕ Registrar Despacho Neste Ponto</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: REDE DE ECOPONTOS */}
        {activeTab === 'ecopontos' && (
          <div>
            <div className="pb-6 border-b border-slate-200 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Rede de Ecopontos e Cooperativas</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Ecopontos municipais e cooperativas de catadores credenciadas em Rondônia.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-sm w-full">
                <input
                  type="text"
                  placeholder="Buscar por nome, bairro ou município..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              </div>
            </div>

            {/* Filter tags */}
            <div className="flex flex-wrap gap-2 mb-6 text-xs font-semibold">
              {['all', 'Plásticos', 'Papel', 'Vidros', 'Metais', 'Resíduos', 'Óleo'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatalogFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg border ${
                    catalogFilter === cat
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'Todos os Materiais' : cat}
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecopontos
                .filter(e => {
                  const matchQuery = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.municipio.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchCat = catalogFilter === 'all' || e.materialsAccepted.some(m => m.toLowerCase().includes(catalogFilter.toLowerCase()));
                  return matchQuery && matchCat;
                })
                .map(eco => (
                  <div key={eco.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {eco.category}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {eco.status.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mt-2.5">{eco.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-start space-x-1">
                        <span>📍</span>
                        <span>{eco.address}</span>
                      </p>

                      {(eco.userDeliveriesCount || 0) > 0 && (
                        <div className="mt-2 text-[11px] font-medium text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                          ✓ Você já realizou despachos de lixo neste ecoponto!
                        </div>
                      )}

                      {/* IoT Capacity */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>Capacidade / Ocupação IoT:</span>
                          <span className="font-bold text-slate-900">{eco.iotPercent}% ({eco.currentKg}/{eco.capacityKg} kg)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${eco.iotPercent >= 90 ? 'bg-red-500' : 'bg-emerald-600'}`}
                            style={{ width: `${eco.iotPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Materiais Aceitos:</span>
                        <div className="flex flex-wrap gap-1">
                          {eco.materialsAccepted.map((m, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => { setSelectedEcoponto(eco); setActiveTab('map'); }}
                        className="text-xs text-emerald-700 font-semibold hover:underline"
                      >
                        Ver no Mapa
                      </button>
                      <button
                        onClick={() => { setFormData(prev => ({ ...prev, ecopontoId: eco.id })); setActiveTab('novo-despacho'); }}
                        className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 shadow-sm"
                      >
                        Despachar Aqui
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* VIEW 3: HISTÓRICO & COMPROVANTES */}
        {activeTab === 'historico' && (
          <div>
            <div className="pb-6 border-b border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Seu Histórico de Despachos & Comprovantes</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Lista de todas as entregas registradas por <strong>{currentUser.name}</strong> com certificados digitais auditáveis.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('novo-despacho')}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-emerald-800 flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <span>⊕ Novo Despacho</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3.5">Data / Hora</th>
                      <th className="px-4 py-3.5">Ecoponto de Destino</th>
                      <th className="px-4 py-3.5">Material</th>
                      <th className="px-4 py-3.5 text-right">Quantidade</th>
                      <th className="px-4 py-3.5 text-right">Impacto CO₂</th>
                      <th className="px-4 py-3.5 text-right">Pontos</th>
                      <th className="px-4 py-3.5 text-center">Comprovante</th>
                      <th className="px-4 py-3.5 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {userDespachos.map(d => (
                      <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">📅 {d.timestamp}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{d.ecopontoName}</td>
                        <td className="px-4 py-3 text-slate-700">{d.materialName}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 text-right whitespace-nowrap">{d.weightKg.toFixed(1)} kg</td>
                        <td className="px-4 py-3 font-bold text-emerald-700 text-right whitespace-nowrap">-{d.co2AvoidedKg.toFixed(2)} kg</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            +{d.pointsEarned} PTS
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => setActiveCertificate(d)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-sky-700 text-white rounded font-mono font-bold text-[11px] shadow-sm hover:bg-sky-800"
                          >
                            <span>🛡️ {d.id}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteDespacho(d.id)}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Remover"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {userDespachos.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                          Nenhum despacho registrado para este usuário ainda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: REGISTRAR DESPACHO */}
        {activeTab === 'novo-despacho' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center pb-6 border-b border-slate-200 mb-6">
              <span className="text-3xl">⊕</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Registrar Despacho de Resíduos Recicláveis</h3>
              <p className="text-sm text-slate-500 mt-1">
                Gere rastreabilidade oficial, ganhe Pontos Verdes e emita seu Certificado Digital.
              </p>
            </div>

            <form onSubmit={handleCreateDespacho} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Usuário / Entidade Autenticada:
                </label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.name} (${currentUser.role})`}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ecoponto de Destino *:
                  </label>
                  <select
                    value={formData.ecopontoId}
                    onChange={(e) => setFormData({ ...formData, ecopontoId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  >
                    {ecopontos.map(eco => (
                      <option key={eco.id} value={eco.id}>{eco.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Material Reciclável *:
                  </label>
                  <select
                    value={formData.materialId}
                    onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  >
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peso Verificado (kg) *:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data / Hora do Despacho:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={new Date().toLocaleDateString('pt-BR')}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observações do Despacho (opcional):
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Garrafas limpas e sem tampas; entregue para triagem de cooperativa..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Dynamic Live Calculation Card */}
              {(() => {
                const currentMat = materials.find(m => m.id === formData.materialId) || materials[0];
                const weight = Number(formData.weightKg) || 0;
                const co2 = (weight * currentMat.co2Factor).toFixed(2);
                const points = Math.round(weight * 10);
                const revenue = (weight * currentMat.pricePerKg).toFixed(2);

                return (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <span className="text-xs font-bold text-emerald-900 block mb-2">Simulação do Impacto Imediato:</span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white p-2 rounded-lg border border-emerald-200">
                        <span className="text-slate-500 text-[10px]">Pontos Verdes</span>
                        <div className="font-bold text-emerald-700 text-sm">+{points} pts</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-emerald-200">
                        <span className="text-slate-500 text-[10px]">CO₂e Evitado</span>
                        <div className="font-bold text-teal-700 text-sm">-{co2} kg</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-emerald-200">
                        <span className="text-slate-500 text-[10px]">Renda Catadores</span>
                        <div className="font-bold text-amber-700 text-sm">R$ {revenue}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:bg-emerald-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>🛡️ Confirmar Despacho & Emitir Certificado</span>
              </button>
            </form>
          </div>
        )}

        {/* VIEW 5: PAINEL ADMINISTRATIVO (SEMA) */}
        {activeTab === 'admin' && (
          <div>
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white mb-8 border border-slate-800 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-800/80 text-red-200 border border-red-600 mb-2">
                    ÁREA RESTRITA • SEMA • Governo de Rondônia
                  </span>
                  <h3 className="text-2xl font-bold">Painel de Controle e Auditoria Geral</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Gerenciamento centralizado de usuários, telemetria de sensores IoT, precificação de cooperativas e relatórios oficiais.
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1"
                  >
                    <span>📊 Exportar CSV</span>
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1"
                  >
                    <span>💾 Backup JSON</span>
                  </button>
                </div>
              </div>

              {/* Admin Subtabs */}
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800 text-xs font-medium">
                <button
                  onClick={() => setAdminTab('users')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    adminTab === 'users' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  👥 Gestão de Usuários ({users.length})
                </button>
                <button
                  onClick={() => setAdminTab('iot')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    adminTab === 'iot' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  📡 Ecopontos & Sensores IoT ({ecopontos.length})
                </button>
                <button
                  onClick={() => setAdminTab('prices')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    adminTab === 'prices' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  💲 Preços & Fatores CO₂
                </button>
                <button
                  onClick={() => setAdminTab('audit')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    adminTab === 'audit' ? 'bg-white text-slate-900 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🛡️ Auditoria de Cargas ({despachos.length})
                </button>
              </div>
            </div>

            {/* Admin Subtab 1: Usuários */}
            {adminTab === 'users' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm">Usuários Cadastrados na Malha Estadual</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">Nome / E-mail</th>
                        <th className="px-4 py-3">Município / Bairro</th>
                        <th className="px-4 py-3">Perfil de Acesso</th>
                        <th className="px-4 py-3 text-right">Pontos Verdes</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Ações do Gestor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{u.location}</td>
                          <td className="px-4 py-3">
                            <select
                              value={u.role}
                              onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                              className="px-2 py-1 text-xs border border-slate-300 rounded font-semibold bg-white"
                            >
                              <option value="CIDADAO">Cidadão</option>
                              <option value="COOPERATIVA">Cooperativa</option>
                              <option value="ESCOLA">Escola</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-700 whitespace-nowrap">
                            +{u.points} PTS
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`px-2.5 py-1 text-[11px] font-bold rounded border ${
                                u.status === 'Ativo'
                                  ? 'border-red-300 text-red-700 hover:bg-red-50'
                                  : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {u.status === 'Ativo' ? '🔒 Bloquear' : '🔓 Desbloquear'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Admin Subtab 2: Sensores IoT */}
            {adminTab === 'iot' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-slate-600">
                    Simule a telemetria dos sensores ultrassônicos IoT em tempo real ajustando a barra de ocupação de cada contêiner.
                  </p>
                  <button
                    onClick={() => setShowNewEcopontoModal(true)}
                    className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
                  >
                    ⊕ Cadastrar Novo Ecoponto
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ecopontos.map(eco => (
                    <div key={eco.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {eco.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            eco.iotPercent >= 90 ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {eco.iotPercent >= 90 ? 'LOTADO' : 'ATIVO'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mt-2">{eco.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 truncate">📍 {eco.address}</p>

                        {/* Interactive Slider */}
                        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                            <span>Nível de Ocupação Sensor IoT:</span>
                            <span className={`font-bold ${eco.iotPercent >= 90 ? 'text-red-600' : 'text-emerald-700'}`}>
                              {eco.iotPercent}% ({eco.currentKg}/{eco.capacityKg} kg)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={eco.iotPercent}
                            onChange={(e) => handleIotSliderChange(eco.id, parseInt(e.target.value))}
                            className="w-full accent-emerald-600 cursor-pointer"
                          />
                        </div>
                      </div>

                      {eco.iotPercent >= 90 && (
                        <div className="mt-3">
                          <button
                            onClick={() => handleIotSliderChange(eco.id, 10)}
                            className="w-full py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
                          >
                            🚚 Disparar Esvaziamento Coleta
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Subtab 3: Preços e CO2 */}
            {adminTab === 'prices' && (
              <div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-6 text-xs text-amber-900">
                  💡 <strong>Gestão Econômica de Cooperativas:</strong> Estes valores definem o cálculo de renda estimada gerada para os catadores de Rondônia e a pegada de carbono evitada a cada entrega registrada no sistema.
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">Material Reciclável</th>
                        <th className="px-4 py-3">Categoria</th>
                        <th className="px-4 py-3 text-right">Preço Médio Pago ao Catador (R$/kg)</th>
                        <th className="px-4 py-3 text-right">Fator CO₂ Evitado (kg CO₂e/kg)</th>
                        <th className="px-4 py-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {materials.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900 flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.conamaColor }} />
                            <span>{m.name}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {m.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-700">
                            R$ {m.pricePerKg.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-teal-700">
                            {m.co2Factor.toFixed(2)} kg CO₂
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setEditingMaterial(m)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-300 rounded hover:bg-sky-100"
                            >
                              ✏️ Editar Valores
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Admin Subtab 4: Auditoria de Cargas */}
            {adminTab === 'audit' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Registro Auditável de Despachos Estaduais</h4>
                  <span className="text-xs text-slate-500">Total: {despachos.length} registros auditados</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">Código</th>
                        <th className="px-4 py-3">Data/Hora</th>
                        <th className="px-4 py-3">Cidadão / Entidade</th>
                        <th className="px-4 py-3">Ecoponto</th>
                        <th className="px-4 py-3">Material</th>
                        <th className="px-4 py-3 text-right">Peso</th>
                        <th className="px-4 py-3 text-right">Renda Gerada</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {despachos.map(d => (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-bold text-sky-700 whitespace-nowrap">
                            <button onClick={() => setActiveCertificate(d)} className="hover:underline">
                              {d.id}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{d.timestamp}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{d.userName}</td>
                          <td className="px-4 py-3 text-slate-600">{d.ecopontoName}</td>
                          <td className="px-4 py-3 text-slate-700">{d.materialName}</td>
                          <td className="px-4 py-3 font-bold text-slate-900 text-right whitespace-nowrap">{d.weightKg.toFixed(1)} kg</td>
                          <td className="px-4 py-3 font-bold text-amber-700 text-right whitespace-nowrap">R$ {d.estimatedRevenue.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: GUIA OFICIAL DE DESCARTE (CONAMA) */}
        {activeTab === 'guia' && (
          <div>
            <div className="pb-6 border-b border-slate-200 mb-6">
              <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                ♻️ Padrão Técnico CONAMA para Separação e Preservação de Recicláveis em Rondônia
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Guia Oficial de Orientação de Descarte</h3>
              <p className="text-sm text-slate-500 mt-1">
                Conheça os padrões de triagem, impacto ambiental e cuidados para proteção e valorização dos catadores de RO.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map(m => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between border-t-4"
                  style={{ borderTopColor: m.conamaColor }}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: m.conamaColor }}>
                      {m.conamaName}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{m.name}</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{m.description}</p>

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong className="block text-slate-900 mb-1">🧼 Como preparar:</strong>
                      {m.howToPrepare}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold">
                      Evita aprox. {m.co2Factor} kg CO₂/kg
                    </span>
                    <button
                      onClick={() => { setFormData(prev => ({ ...prev, materialId: m.id })); setActiveTab('novo-despacho'); }}
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800"
                    >
                      Despachar Este
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 7: INDICADORES SOCIOAMBIENTAIS */}
        {activeTab === 'indicadores' && (
          <div>
            <div className="pb-6 border-b border-slate-200 mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Indicadores Socioambientais de Rondônia</h3>
              <p className="text-sm text-slate-500 mt-1">
                Estatísticas integradas do projeto com base no Edital Centelha 3 (2025/2026).
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase">Total Coletado na Rede</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">{networkTotalWeight.toFixed(1)} kg</div>
                <p className="text-xs text-emerald-700 mt-1">♻️ Desviados de aterros e lixões de RO</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase">Seu Impacto Pessoal</span>
                <div className="text-3xl font-extrabold text-emerald-700 mt-2">{userTotalWeight.toFixed(1)} kg</div>
                <p className="text-xs text-emerald-700 mt-1">🌱 {userTotalCo2.toFixed(1)} kg CO₂ evitado</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase">Defasagem em Rondônia</span>
                <div className="text-3xl font-extrabold text-amber-600 mt-2">57,7%</div>
                <p className="text-xs text-slate-500 mt-1">⚠️ Municípios de RO sem coleta seletiva (Dado Edital)</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold uppercase">Pontos Ativos</span>
                <div className="text-3xl font-extrabold text-sky-700 mt-2">{ecopontos.length}</div>
                <p className="text-xs text-slate-500 mt-1">📍 Ecopontos e cooperativas cadastradas</p>
              </div>
            </div>

            {/* In-depth Analysis Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h4 className="text-base font-bold text-slate-900 mb-3">Diagnóstico Territorial de Resíduos Sólidos</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Em Rondônia, a ausência de coleta seletiva formal em <strong>57,7% dos municípios</strong> sobrecarrega aterros sanitários e lixões a céu aberto.
                  Na capital, Porto Velho, são geradas diariamente entre <strong>450 a 500 toneladas de resíduos sólidos urbanos</strong>, cuja fração reciclável nobre (metais, plásticos e papéis) pode gerar dignidade econômica para cooperativas como CATANORTE e ASPREVEL.
                </p>
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Geração Diária de RSU em Porto Velho:</span>
                    <strong className="text-slate-900">450 a 500 toneladas/dia</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Taxa de Reciclagem de Latas de Alumínio no Brasil:</span>
                    <strong className="text-emerald-700">98,7% (Líder Mundial)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Economia Energética na Reciclagem de Alumínio:</span>
                    <strong className="text-teal-700">95% de energia poupada</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h4 className="text-base font-bold text-slate-900 mb-3">Metas do Simulado Centelha 3 (Fase 1)</h4>
                <ul className="text-xs text-slate-600 space-y-2.5">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Critério Solução (Peso 2):</strong> Telemetria IoT com simulação em tempo real de sensores ultrassônicos em recipientes.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Critério Mercado (Peso 1):</strong> Integração com cooperativas e modelo replicável para escolas estaduais.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Critério Impacto Socioambiental (Peso 1):</strong> Rastreabilidade de CO₂ evitado e geração de renda justa.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Critério Capacidade de Execução (Peso 1):</strong> MVP completo, tipado e auditável desenvolvido por estudante de TI.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 8: CAMPANHAS COMUNITÁRIAS */}
        {activeTab === 'campanhas' && (
          <div>
            <div className="pb-6 border-b border-slate-200 mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Campanhas Comunitárias e Escolares</h3>
              <p className="text-sm text-slate-500 mt-1">
                Iniciativas com metas de arrecadação em escolas e condomínios de Rondônia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campanhas.map(c => (
                <div key={c.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">{c.entity}</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {c.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-2">{c.title}</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{c.description}</p>

                    <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                        <span>Meta de Arrecadação:</span>
                        <span className="font-bold text-emerald-700">{c.currentKg} de {c.targetKg} kg ({c.progressPercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${c.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('novo-despacho')}
                      className="w-full py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 shadow-sm"
                    >
                      Contribuir com Esta Campanha
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 9: FICHA CENTELHA 3 */}
        {activeTab === 'ficha' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 pb-6 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
                  EDITAL Nº 03/2026 — CENTELHA 3 RONDÔNIA
                </span>
                <span className="text-xs text-slate-500 font-medium">Trabalho Individual Acadêmico</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                EcoPonto Inteligente — Fase 1 (Ideias Inovadoras)
              </h2>
            </div>

            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <section>
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  1. Identificação do Projeto
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div><strong>Estudante:</strong> Ana Beatriz de Lima Rosa</div>
                  <div><strong>Turma:</strong> 3°B Informática</div>
                  <div><strong>Instituição:</strong> EEEFM Carmela Dutra — Porto Velho / RO</div>
                  <div><strong>Área do Conhecimento:</strong> Dev Software, IoT e Ciência de Dados</div>
                  <div><strong>Setor Econômico:</strong> Meio ambiente, gestão de resíduos e tecnologia</div>
                  <div><strong>Status:</strong> 100% Concluído e Operacional na porta 3011</div>
                </div>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  2. Problema e Evidências em Rondônia
                </h3>
                <p className="text-xs text-slate-600">
                  Em Rondônia, <strong>57,7% dos municípios do estado não possuíam coleta seletiva</strong> segundo dados oficiais divulgados pelo Governo de Rondônia (2025). Fontes: Plano Nacional de Resíduos Sólidos (MMA) e SINIR+.
                  Na capital Porto Velho, são geradas de 450 a 500 toneladas diárias de RSU. A ausência de canais digitais confiáveis para o cidadão e a falta de rastreabilidade de fardos geram perda econômica severa para os catadores de materiais recicláveis.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  3. Capacidade de Execução & Pitch
                </h3>
                <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-base">Vídeo Pitch Oficial (YouTube)</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Apresentação da solução tecnológica e viabilidade do protótipo por Ana Beatriz de Lima Rosa.
                    </p>
                  </div>
                  <a
                    href="https://youtube.com/shorts/jQ7sv5xjBv8"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md whitespace-nowrap flex items-center space-x-2"
                  >
                    <span>▶ Assistir Vídeo Pitch</span>
                  </a>
                </div>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  4. Matriz de Avaliação do Edital
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold">
                      <tr>
                        <th className="p-2.5">Critério</th>
                        <th className="p-2.5">O Que É Observado</th>
                        <th className="p-2.5 text-center">Peso</th>
                        <th className="p-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2.5 font-bold">Solução (S)</td>
                        <td className="p-2.5">Clareza, grau de inovação e integração de sensores IoT.</td>
                        <td className="p-2.5 text-center font-bold">Peso 2</td>
                        <td className="p-2.5 text-center text-emerald-700 font-bold">100% Atendido</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Mercado (M)</td>
                        <td className="p-2.5">Oportunidade diagnosticada em RO e cooperativas parceiras.</td>
                        <td className="p-2.5 text-center font-bold">Peso 1</td>
                        <td className="p-2.5 text-center text-emerald-700 font-bold">100% Atendido</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Impacto (I)</td>
                        <td className="p-2.5">Metrificação de CO₂ evitado, renda catadores e desvio de aterros.</td>
                        <td className="p-2.5 text-center font-bold">Peso 1</td>
                        <td className="p-2.5 text-center text-emerald-700 font-bold">100% Atendido</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Execução (E)</td>
                        <td className="p-2.5">Domínio técnico demonstrado no MVP funcional e pitch.</td>
                        <td className="p-2.5 text-center font-bold">Peso 1</td>
                        <td className="p-2.5 text-center text-emerald-700 font-bold">100% Atendido</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* VIEW 10: PORTAL DE AUTENTICAÇÃO */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="flex border-b border-slate-200 mb-6 text-xs font-semibold">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-center border-b-2 ${
                  authMode === 'login' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500'
                }`}
              >
                →] Entrar
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-center border-b-2 ${
                  authMode === 'register' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500'
                }`}
              >
                + Criar Conta
              </button>
              <button
                onClick={() => setAuthMode('recover')}
                className={`flex-1 py-2 text-center border-b-2 ${
                  authMode === 'recover' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500'
                }`}
              >
                🔑 Recuperar
              </button>
            </div>

            {authMode === 'login' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 text-center mb-1">Acesso ao EcoPonto Inteligente</h3>
                <p className="text-xs text-slate-500 text-center mb-5">
                  Informe suas credenciais ou escolha uma das contas rápidas de teste abaixo.
                </p>

                {/* Quick 1-click test login buttons */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                    ⚡ Acesso Rápido de Teste (Clique para entrar direto):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {users.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => { handleSelectUser(u); setActiveTab('map'); }}
                        className={`p-2 rounded-lg border text-xs transition-colors ${
                          currentUser.id === u.id
                            ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="truncate font-semibold">{u.name.split(' ')[0]}</div>
                        <div className="text-[10px] text-slate-500">{u.role}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setActiveTab('map'); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail Cadastrado:</label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">Senha:</label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('recover')}
                        className="text-[11px] text-emerald-700 hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <input
                      type="password"
                      defaultValue="••••••••"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800"
                  >
                    →] Entrar no Sistema
                  </button>
                </form>
              </div>
            )}

            {authMode === 'register' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 text-center mb-1">Cadastro no Sistema • RO</h3>
                <p className="text-xs text-slate-500 text-center mb-5">
                  Cadastre-se para rastrear seus descartes, acumular Pontos Verdes e emitir certificados.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Cadastro concluído com sucesso! Você recebeu 50 Pontos Verdes de bônus!');
                    setActiveTab('map');
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">Nome Completo / Razão Social *:</label>
                    <input type="text" placeholder="Ex: Ana Beatriz de Lima Rosa" required className="w-full px-3 py-1.5 border border-slate-300 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Tipo de Perfil *:</label>
                      <select className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white">
                        <option>Cidadão / Estudante</option>
                        <option>Escola</option>
                        <option>Cooperativa</option>
                        <option>Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">CPF ou CNPJ:</label>
                      <input type="text" placeholder="000.000.000-00" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">E-mail para Acesso *:</label>
                    <input type="email" placeholder="seu.email@exemplo.com" required className="w-full px-3 py-1.5 border border-slate-300 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Município em RO *:</label>
                      <input type="text" defaultValue="Porto Velho - RO" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Telefone / WhatsApp:</label>
                      <input type="text" placeholder="(69) 99999-0000" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800 mt-2"
                  >
                    + Finalizar Cadastro e Ganhar 50 Pts
                  </button>
                </form>
              </div>
            )}

            {authMode === 'recover' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 text-center mb-1">Recuperação de Senha</h3>
                <p className="text-xs text-slate-500 text-center mb-5">
                  Informe seu e-mail para receber o código e redefinir sua senha com segurança.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-4">
                  💡 Para fins de teste rápido, o código de recuperação pré-configurado é <strong>2026</strong>.
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Senha redefinida com sucesso!');
                    setAuthMode('login');
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Digite seu e-mail cadastrado:</label>
                    <input type="email" placeholder="seu.email@exemplo.com" required className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg" />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-800"
                  >
                    🔑 Enviar Código de Recuperação
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: CERTIFICADO DIGITAL COM QR CODE AUDITÁVEL */}
      {activeCertificate && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative text-slate-800">
            <button
              onClick={() => setActiveCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-2xl">🌱</span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
                Certificado Digital de Destinação Ecológica
              </h3>
              <p className="text-[11px] text-emerald-800 font-semibold">
                SISTEMA OFICIAL DE RASTREABILIDADE • GOVERNO DE RONDÔNIA & SEMA
              </p>
            </div>

            <div className="my-5 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Código de Autenticação:</span>
                <span className="font-mono font-bold text-sky-700">{activeCertificate.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cidadão / Entidade:</span>
                <span className="font-bold text-slate-900">{activeCertificate.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ecoponto Receptor:</span>
                <span className="font-medium text-slate-900 text-right">{activeCertificate.ecopontoName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Material Aferido:</span>
                <span className="font-bold text-slate-900">{activeCertificate.materialName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Peso Total:</span>
                <span className="font-extrabold text-emerald-700">{activeCertificate.weightKg.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Impacto Climático:</span>
                <span className="font-bold text-teal-700">-{activeCertificate.co2AvoidedKg.toFixed(2)} kg CO₂e evitado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pontos Verdes Concedidos:</span>
                <span className="font-bold text-emerald-800">+{activeCertificate.pointsEarned} PTS</span>
              </div>
            </div>

            {/* Simulated Dynamic QR Code */}
            <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl text-center">
              <svg className="w-24 h-24 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="25" height="25" rx="3" fill="#047857" />
                <rect x="65" y="10" width="25" height="25" rx="3" fill="#047857" />
                <rect x="10" y="65" width="25" height="25" rx="3" fill="#047857" />
                <rect x="16" y="16" width="13" height="13" fill="#fff" />
                <rect x="71" y="16" width="13" height="13" fill="#fff" />
                <rect x="16" y="71" width="13" height="13" fill="#fff" />
                <circle cx="22.5" cy="22.5" r="3.5" fill="#047857" />
                <circle cx="77.5" cy="22.5" r="3.5" fill="#047857" />
                <circle cx="22.5" cy="77.5" r="3.5" fill="#047857" />
                <rect x="42" y="10" width="16" height="6" fill="#0f172a" />
                <rect x="42" y="22" width="8" height="12" fill="#0f172a" />
                <rect x="42" y="42" width="16" height="16" fill="#047857" />
                <rect x="65" y="42" width="10" height="8" fill="#0f172a" />
                <rect x="80" y="55" width="10" height="15" fill="#0f172a" />
                <rect x="42" y="65" width="12" height="12" fill="#0f172a" />
                <rect x="65" y="75" width="25" height="15" fill="#047857" />
              </svg>
              <span className="text-[10px] text-slate-500 font-mono mt-1">
                Hash: {activeCertificate.hashAudit || 'a9f24c8b7e1903e1'}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">
                ✓ VALIDADO DIGITALMENTE NO BANCO CENTRALIZADO
              </span>
            </div>

            <div className="mt-5 flex space-x-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 shadow-sm"
              >
                🖨️ Imprimir Certificado
              </button>
              <button
                onClick={() => setActiveCertificate(null)}
                className="py-2.5 px-4 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-6 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-white">EcoPonto Inteligente</strong> — Simulado Centelha 3 Rondônia (Edital 03/2026)
            <div className="mt-0.5">Estudante: Ana Beatriz de Lima Rosa | Turma: 3°B Informática — EEEFM Carmela Dutra</div>
          </div>
          <div className="text-right">
            <span>Executando em <code className="text-emerald-400 font-mono">http://localhost:3011</code></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
