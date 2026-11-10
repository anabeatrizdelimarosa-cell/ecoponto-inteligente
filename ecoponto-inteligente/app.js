// EcoPonto Inteligente — Aplicação Web Interativa (app.js)
// Simulado Programa Centelha 3 Rondônia - Edital 03/2026
// Estudante: Ana Beatriz de Lima Rosa | 3°B Informática - Carmela Dutra

(function () {
  'use strict';

  // INITIAL DATA
  const DEFAULT_USERS = [
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

  const DEFAULT_MATERIALS = [
    {
      id: 'mat-plastico',
      name: 'Plásticos (PET, PEAD, PEBD, PP)',
      category: 'PLASTICO',
      pricePerKg: 2.40,
      co2Factor: 1.53,
      conamaColor: '#DC2626',
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
      conamaColor: '#2563EB',
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
      conamaColor: '#16A34A',
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
      conamaColor: '#CA8A04',
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
      conamaColor: '#EA580C',
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
      conamaColor: '#D97706',
      conamaName: 'COLETA CONAMA • ÓLEO',
      description: 'Óleo de cozinha usado pós-fritura doméstica ou comercial.',
      howToPrepare: 'Espere esfriar completamente. Filtre com funil e gaze para remover farelos e armazene em garrafas PET transparentes bem vedadas. Evita a contaminação de até 25 mil litros de água por litro de óleo despejado no Rio Madeira.'
    }
  ];

  const DEFAULT_ECOPONTOS = [
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

  const DEFAULT_DESPACHOS = [
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

  const DEFAULT_CAMPANHAS = [
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

  // APP STATE
  const state = {
    users: JSON.parse(localStorage.getItem('eco_users')) || DEFAULT_USERS,
    materials: JSON.parse(localStorage.getItem('eco_materials')) || DEFAULT_MATERIALS,
    ecopontos: JSON.parse(localStorage.getItem('eco_ecopontos')) || DEFAULT_ECOPONTOS,
    despachos: JSON.parse(localStorage.getItem('eco_despachos')) || DEFAULT_DESPACHOS,
    campanhas: JSON.parse(localStorage.getItem('eco_campanhas')) || DEFAULT_CAMPANHAS,
    currentUser: JSON.parse(localStorage.getItem('eco_current_user')) || DEFAULT_USERS[0],
    activeTab: 'map',
    adminTab: 'users',
    mapFilter: 'all',
    selectedEcopontoId: 'eco-sema',
    searchQuery: '',
    catalogCategory: 'all'
  };

  function saveState() {
    localStorage.setItem('eco_users', JSON.stringify(state.users));
    localStorage.setItem('eco_materials', JSON.stringify(state.materials));
    localStorage.setItem('eco_ecopontos', JSON.stringify(state.ecopontos));
    localStorage.setItem('eco_despachos', JSON.stringify(state.despachos));
    localStorage.setItem('eco_campanhas', JSON.stringify(state.campanhas));
    localStorage.setItem('eco_current_user', JSON.stringify(state.currentUser));
    updateHeaderStats();
  }

  function getMetrics() {
    const userDespachos = state.despachos.filter(d => d.userId === state.currentUser.id);
    const userWeight = userDespachos.reduce((sum, d) => sum + d.weightKg, 0);
    const userCo2 = userDespachos.reduce((sum, d) => sum + d.co2AvoidedKg, 0);
    const totalWeight = state.despachos.reduce((sum, d) => sum + d.weightKg, 0);
    return {
      userWeight: userWeight.toFixed(1),
      userCo2: userCo2.toFixed(1),
      userPoints: state.currentUser.points,
      totalWeight: totalWeight.toFixed(1)
    };
  }

  function updateHeaderStats() {
    const metrics = getMetrics();
    document.getElementById('header-user-avatar').textContent = state.currentUser.avatarInitial || state.currentUser.name[0];
    document.getElementById('header-user-name').textContent = state.currentUser.name;
    document.getElementById('header-user-badge').textContent = `${state.currentUser.role} • ${state.currentUser.points} pts`;

    document.getElementById('hero-user-name').textContent = state.currentUser.name;
    document.getElementById('hero-user-location').textContent = `(${state.currentUser.location})`;

    document.getElementById('stat-user-weight').textContent = `${metrics.userWeight} kg`;
    document.getElementById('stat-user-co2').textContent = `${metrics.userCo2} kg`;
    document.getElementById('stat-user-points').textContent = `${metrics.userPoints} pts`;
    document.getElementById('stat-network-weight').textContent = `${metrics.totalWeight} kg`;

    document.getElementById('nav-ecopontos-count').textContent = `(${state.ecopontos.length})`;
    const myCount = state.despachos.filter(d => d.userId === state.currentUser.id).length;
    document.getElementById('nav-historico-count').textContent = `(${myCount})`;
  }

  // TAB SWITCHING
  window.switchTab = function (tabId) {
    state.activeTab = tabId;
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.app-view').forEach(view => {
      view.style.display = view.id === `view-${tabId}` ? 'block' : 'none';
    });

    if (tabId === 'map') renderMapView();
    if (tabId === 'ecopontos') renderEcopontosView();
    if (tabId === 'historico') renderHistoricoView();
    if (tabId === 'novo-despacho') renderNovoDespachoView();
    if (tabId === 'admin') renderAdminView();
    if (tabId === 'guia') renderGuiaView();
    if (tabId === 'indicadores') renderIndicadoresView();
    if (tabId === 'campanhas') renderCampanhasView();
    if (tabId === 'ficha') renderFichaView();
    if (tabId === 'auth') renderAuthView('login');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // VIEW 1: MAPA INTERATIVO
  function renderMapView() {
    const container = document.getElementById('map-pins-list');
    container.innerHTML = '';

    const filtered = state.ecopontos.filter(eco => {
      if (state.mapFilter === 'user') {
        return (eco.userDeliveriesCount || 0) > 0;
      }
      return true;
    });

    filtered.forEach(eco => {
      const isDelivered = (eco.userDeliveriesCount || 0) > 0;
      const isSelected = eco.id === state.selectedEcopontoId;

      const card = document.createElement('div');
      card.className = `map-pin-card ${isDelivered ? 'delivered' : ''} ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="map-pin-top">
          <span class="pin-dot ${isDelivered ? 'pulse-blue' : ''}"></span>
          ${isDelivered ? `<span style="font-size:0.65rem; background:#0369a1; color:white; padding:1px 6px; border-radius:4px; font-weight:700;">✓ ${eco.userDeliveriesCount} entregas</span>` : ''}
        </div>
        <div class="pin-title">${eco.name}</div>
        <div class="pin-cat">${eco.category}</div>
        <div style="margin-top:8px; display:flex; justify-content:space-between; font-size:0.65rem; color:#cbd5e1;">
          <span>IoT Lotação:</span>
          <strong style="color:${eco.iotPercent >= 90 ? '#ef4444' : '#10b981'}">${eco.iotPercent}%</strong>
        </div>
        <div class="progress-bar-bg" style="height:4px; margin-top:2px; background:#334155;">
          <div class="progress-bar-fill ${eco.iotPercent >= 90 ? 'warning' : ''}" style="width:${eco.iotPercent}%;"></div>
        </div>
      `;
      card.onclick = () => {
        state.selectedEcopontoId = eco.id;
        renderMapView();
      };
      container.appendChild(card);
    });

    // Inspector
    const selected = state.ecopontos.find(e => e.id === state.selectedEcopontoId) || state.ecopontos[0];
    const inspector = document.getElementById('map-inspector-body');
    if (selected && inspector) {
      inspector.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="inspector-tag">${selected.category}</span>
            <span style="font-size:0.7rem; font-weight:700; color:#047857; background:#ecfdf5; padding:2px 8px; border-radius:9999px; border:1px solid #a7f3d0;">
              ● ${selected.status}
            </span>
          </div>

          <h4 class="inspector-name">${selected.name}</h4>
          <p class="inspector-address">📍 ${selected.address}</p>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:12px; font-size:0.7rem; font-family:monospace; background:#f8fafc; padding:8px; border-radius:8px; border:1px solid #e2e8f0;">
            <div>Lat: ${selected.lat}</div>
            <div>Long: ${selected.long}</div>
          </div>

          <div class="meter-box">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700;">
              <span>📡 Telemetria de Lotação IoT:</span>
              <span style="color:${selected.iotPercent >= 90 ? '#dc2626' : '#047857'}">
                ${selected.iotPercent}% (${selected.currentKg}/${selected.capacityKg} kg)
              </span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${selected.iotPercent >= 90 ? 'warning' : ''}" style="width:${selected.iotPercent}%;"></div>
            </div>
            ${selected.iotPercent >= 90 ? `
              <div style="margin-top:8px; font-size:0.7rem; color:#b91c1c; font-weight:700; background:#fee2e2; padding:6px 8px; border-radius:6px; border:1px solid #fca5a5;">
                ⚠️ ALERTA: Recipiente em capacidade crítica! Coleta urgente solicitada à SEMA.
              </div>
            ` : ''}
          </div>

          <div style="margin-top:12px;">
            <span style="font-size:0.75rem; font-weight:700; color:#334155; display:block; margin-bottom:6px;">Materiais Aceitos:</span>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              ${selected.materialsAccepted.map(m => `<span style="font-size:0.7rem; background:#f1f5f9; color:#475569; padding:2px 6px; border-radius:4px; border:1px solid #e2e8f0;">${m}</span>`).join('')}
            </div>
          </div>

          ${(selected.userDeliveriesCount || 0) > 0 ? `
            <div style="margin-top:14px; background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:8px 10px; font-size:0.75rem; color:#0369a1; font-weight:600;">
              ✓ Você já realizou <strong>${selected.userDeliveriesCount}</strong> despacho(s) de resíduos neste ecoponto!
            </div>
          ` : ''}
        </div>

        <div style="margin-top:20px;">
          <button class="btn btn-primary btn-block" onclick="prepareDespachoForEcoponto('${selected.id}')">
            ⊕ Registrar Despacho Neste Ponto
          </button>
        </div>
      `;
    }
  }

  window.setMapFilter = function (filterType) {
    state.mapFilter = filterType;
    document.getElementById('btn-map-all').className = `btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`;
    document.getElementById('btn-map-user').className = `btn btn-sm ${filterType === 'user' ? 'btn-primary' : 'btn-secondary'}`;
    renderMapView();
  };

  window.prepareDespachoForEcoponto = function (ecoId) {
    state.selectedEcopontoId = ecoId;
    switchTab('novo-despacho');
    const select = document.getElementById('despacho-ecoponto-select');
    if (select) select.value = ecoId;
  };

  // VIEW 2: REDE DE ECOPONTOS
  function renderEcopontosView() {
    const grid = document.getElementById('ecopontos-cards-grid');
    grid.innerHTML = '';

    const filtered = state.ecopontos.filter(e => {
      const q = state.searchQuery.toLowerCase();
      const matchText = e.name.toLowerCase().includes(q) || e.address.toLowerCase().includes(q) || e.municipio.toLowerCase().includes(q);
      const matchCat = state.catalogCategory === 'all' || e.materialsAccepted.some(m => m.toLowerCase().includes(state.catalogCategory.toLowerCase()));
      return matchText && matchCat;
    });

    filtered.forEach(eco => {
      const card = document.createElement('div');
      card.className = 'main-card';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';
      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="inspector-tag">${eco.category}</span>
            <span style="font-size:0.65rem; font-weight:800; color:#047857; background:#ecfdf5; padding:2px 6px; border-radius:9999px;">
              ${eco.status.toUpperCase()}
            </span>
          </div>

          <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin-top:10px;">${eco.name}</h4>
          <p style="font-size:0.75rem; color:#64748b; margin-top:4px;">📍 ${eco.address}</p>

          ${(eco.userDeliveriesCount || 0) > 0 ? `
            <div style="margin-top:8px; font-size:0.7rem; color:#0369a1; background:#f0f9ff; padding:4px 8px; border-radius:6px; border:1px solid #bae6fd; font-weight:600;">
              ✓ Você já realizou despachos de lixo neste ecoponto!
            </div>
          ` : ''}

          <div style="margin-top:14px; padding-top:12px; border-top:1px solid #f1f5f9;">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:600; color:#334155;">
              <span>Capacidade / Ocupação IoT:</span>
              <strong style="color:#0f172a;">${eco.iotPercent}% (${eco.currentKg}/${eco.capacityKg} kg)</strong>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${eco.iotPercent >= 90 ? 'warning' : ''}" style="width:${eco.iotPercent}%;"></div>
            </div>
          </div>

          <div style="margin-top:12px;">
            <span style="font-size:0.7rem; font-weight:700; color:#64748b; display:block; margin-bottom:4px;">Materiais Aceitos:</span>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              ${eco.materialsAccepted.map(m => `<span style="font-size:0.65rem; background:#f1f5f9; color:#475569; padding:2px 6px; border-radius:4px;">${m}</span>`).join('')}
            </div>
          </div>
        </div>

        <div style="margin-top:18px; padding-top:12px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
          <button style="background:none; border:none; color:#047857; font-weight:700; font-size:0.75rem; cursor:pointer;" onclick="viewEcopontoOnMap('${eco.id}')">
            Ver no Mapa
          </button>
          <button class="btn btn-primary btn-sm" onclick="prepareDespachoForEcoponto('${eco.id}')">
            Despachar Aqui
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  window.viewEcopontoOnMap = function (id) {
    state.selectedEcopontoId = id;
    switchTab('map');
  };

  window.filterEcopontosCategory = function (cat) {
    state.catalogCategory = cat;
    document.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    renderEcopontosView();
  };

  window.handleEcopontoSearch = function (val) {
    state.searchQuery = val;
    renderEcopontosView();
  };

  // VIEW 3: HISTÓRICO & COMPROVANTES
  function renderHistoricoView() {
    const tbody = document.getElementById('historico-table-body');
    tbody.innerHTML = '';

    const userDespachos = state.despachos.filter(d => d.userId === state.currentUser.id);

    if (userDespachos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:#94a3b8;">Nenhum despacho registrado para este usuário ainda.</td></tr>`;
      return;
    }

    userDespachos.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family:monospace; color:#64748b; white-space:nowrap;">📅 ${d.timestamp}</td>
        <td style="font-weight:600; color:#0f172a;">${d.ecopontoName}</td>
        <td style="color:#334155;">${d.materialName}</td>
        <td style="font-weight:700; text-align:right; white-space:nowrap;">${d.weightKg.toFixed(1)} kg</td>
        <td style="font-weight:700; color:#047857; text-align:right; white-space:nowrap;">-${d.co2AvoidedKg.toFixed(2)} kg</td>
        <td style="text-align:right; white-space:nowrap;">
          <span style="font-weight:700; color:#047857; background:#ecfdf5; padding:2px 8px; border-radius:4px; border:1px solid #a7f3d0;">
            +${d.pointsEarned} PTS
          </span>
        </td>
        <td style="text-align:center; white-space:nowrap;">
          <button class="btn btn-sm" style="background:#0284c7; color:white; font-family:monospace; font-weight:700;" onclick="openCertificateModal('${d.id}')">
            🛡️ ${d.id}
          </button>
        </td>
        <td style="text-align:center; white-space:nowrap;">
          <button style="background:none; border:none; cursor:pointer; color:#94a3b8; font-size:1rem;" title="Remover" onclick="deleteDespacho('${d.id}')">
            🗑️
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.deleteDespacho = function (id) {
    if (confirm(`Deseja realmente remover o registro de despacho ${id}?`)) {
      state.despachos = state.despachos.filter(d => d.id !== id);
      saveState();
      renderHistoricoView();
    }
  };

  // VIEW 4: REGISTRAR DESPACHO
  function renderNovoDespachoView() {
    const ecoSelect = document.getElementById('despacho-ecoponto-select');
    const matSelect = document.getElementById('despacho-material-select');

    ecoSelect.innerHTML = state.ecopontos.map(e => `<option value="${e.id}" ${e.id === state.selectedEcopontoId ? 'selected' : ''}>${e.name}</option>`).join('');
    matSelect.innerHTML = state.materials.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

    updateDespachoLiveCalc();
  }

  window.updateDespachoLiveCalc = function () {
    const matId = document.getElementById('despacho-material-select')?.value;
    const weightInput = parseFloat(document.getElementById('despacho-weight-input')?.value) || 0;
    const mat = state.materials.find(m => m.id === matId) || state.materials[0];

    const pts = Math.round(weightInput * 10);
    const co2 = (weightInput * mat.co2Factor).toFixed(2);
    const rev = (weightInput * mat.pricePerKg).toFixed(2);

    document.getElementById('calc-pts').textContent = `+${pts} pts`;
    document.getElementById('calc-co2').textContent = `-${co2} kg`;
    document.getElementById('calc-rev').textContent = `R$ ${rev}`;
  };

  window.submitDespachoForm = function (e) {
    e.preventDefault();
    const ecoId = document.getElementById('despacho-ecoponto-select').value;
    const matId = document.getElementById('despacho-material-select').value;
    const weight = parseFloat(document.getElementById('despacho-weight-input').value) || 1;
    const notes = document.getElementById('despacho-notes-input').value;

    const eco = state.ecopontos.find(e => e.id === ecoId) || state.ecopontos[0];
    const mat = state.materials.find(m => m.id === matId) || state.materials[0];

    const pts = Math.round(weight * 10);
    const co2 = parseFloat((weight * mat.co2Factor).toFixed(2));
    const rev = parseFloat((weight * mat.pricePerKg).toFixed(2));
    const code = `ECO-RO-2026-00${state.despachos.length + 1}`;

    const newDespacho = {
      id: code,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      ecopontoId: eco.id,
      ecopontoName: eco.name,
      materialName: mat.name,
      category: mat.category,
      weightKg: weight,
      co2AvoidedKg: co2,
      pointsEarned: pts,
      estimatedRevenue: rev,
      status: 'VALIDADO NO ECOPONTO',
      notes: notes,
      hashAudit: Math.random().toString(16).substring(2, 18)
    };

    state.despachos.unshift(newDespacho);

    // Increase user points
    state.currentUser.points += pts;
    const userInDb = state.users.find(u => u.id === state.currentUser.id);
    if (userInDb) userInDb.points += pts;

    // Increase ecoponto user deliveries count
    eco.userDeliveriesCount = (eco.userDeliveriesCount || 0) + 1;

    saveState();
    openCertificateModal(newDespacho.id);
  };

  // VIEW 5: ADMIN SEMA
  function renderAdminView() {
    document.querySelectorAll('.admin-subtab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-admin-tab') === state.adminTab);
    });
    document.querySelectorAll('.admin-subview').forEach(view => {
      view.style.display = view.id === `admin-view-${state.adminTab}` ? 'block' : 'none';
    });

    if (state.adminTab === 'users') renderAdminUsers();
    if (state.adminTab === 'iot') renderAdminIot();
    if (state.adminTab === 'prices') renderAdminPrices();
    if (state.adminTab === 'audit') renderAdminAudit();
  }

  window.switchAdminTab = function (subtab) {
    state.adminTab = subtab;
    renderAdminView();
  };

  function renderAdminUsers() {
    const tbody = document.getElementById('admin-users-tbody');
    tbody.innerHTML = '';
    state.users.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-weight:700; color:#0f172a;">${u.name}</div>
          <div style="font-size:0.65rem; color:#64748b; font-family:monospace;">${u.email}</div>
        </td>
        <td style="color:#475569;">${u.location}</td>
        <td>
          <select style="font-size:0.75rem; padding:3px 6px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;" onchange="changeUserRole('${u.id}', this.value)">
            <option value="CIDADAO" ${u.role === 'CIDADAO' ? 'selected' : ''}>Cidadão</option>
            <option value="COOPERATIVA" ${u.role === 'COOPERATIVA' ? 'selected' : ''}>Cooperativa</option>
            <option value="ESCOLA" ${u.role === 'ESCOLA' ? 'selected' : ''}>Escola</option>
            <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td style="font-weight:700; color:#047857; text-align:right;">+${u.points} PTS</td>
        <td style="text-align:center;">
          <span style="font-size:0.65rem; font-weight:800; padding:2px 8px; border-radius:4px; ${u.status === 'Ativo' ? 'background:#ecfdf5; color:#047857;' : 'background:#fee2e2; color:#b91c1c;'}">
            ${u.status}
          </span>
        </td>
        <td style="text-align:center;">
          <button class="btn btn-sm ${u.status === 'Ativo' ? 'btn-danger' : 'btn-primary'}" onclick="toggleUserStatus('${u.id}')">
            ${u.status === 'Ativo' ? '🔒 Bloquear' : '🔓 Desbloquear'}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.changeUserRole = function (userId, newRole) {
    const u = state.users.find(item => item.id === userId);
    if (u) {
      u.role = newRole;
      if (state.currentUser.id === userId) state.currentUser.role = newRole;
      saveState();
      renderAdminUsers();
    }
  };

  window.toggleUserStatus = function (userId) {
    const u = state.users.find(item => item.id === userId);
    if (u) {
      u.status = u.status === 'Ativo' ? 'Bloqueado' : 'Ativo';
      saveState();
      renderAdminUsers();
    }
  };

  function renderAdminIot() {
    const grid = document.getElementById('admin-iot-grid');
    grid.innerHTML = '';
    state.ecopontos.forEach(eco => {
      const card = document.createElement('div');
      card.className = 'main-card';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';
      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="inspector-tag">${eco.category}</span>
            <span style="font-size:0.65rem; font-weight:800; padding:2px 8px; border-radius:9999px; ${eco.iotPercent >= 90 ? 'background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;' : 'background:#ecfdf5; color:#047857;'}">
              ${eco.iotPercent >= 90 ? 'LOTADO' : 'ATIVO'}
            </span>
          </div>

          <h4 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin-top:8px;">${eco.name}</h4>
          <p style="font-size:0.7rem; color:#64748b; margin-top:2px;">📍 ${eco.address}</p>

          <div class="meter-box" style="margin-top:14px;">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700;">
              <span>Nível de Ocupação Sensor IoT:</span>
              <strong style="color:${eco.iotPercent >= 90 ? '#dc2626' : '#047857'}">
                ${eco.iotPercent}% (${eco.currentKg}/${eco.capacityKg} kg)
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value="${eco.iotPercent}"
              style="width:100%; margin-top:10px; accent-color:#059669; cursor:pointer;"
              oninput="handleIotSlider('${eco.id}', parseInt(this.value))"
            />
          </div>
        </div>

        ${eco.iotPercent >= 90 ? `
          <div style="margin-top:14px;">
            <button class="btn btn-danger btn-block btn-sm" onclick="handleIotSlider('${eco.id}', 10)">
              🚚 Disparar Esvaziamento Coleta SEMA
            </button>
          </div>
        ` : ''}
      `;
      grid.appendChild(card);
    });
  }

  window.handleIotSlider = function (ecoId, val) {
    const eco = state.ecopontos.find(e => e.id === ecoId);
    if (eco) {
      eco.iotPercent = val;
      eco.currentKg = Math.round((val / 100) * eco.capacityKg);
      eco.status = val >= 90 ? 'Lotado' : 'Ativo';
      saveState();
      renderAdminIot();
    }
  };

  function renderAdminPrices() {
    const tbody = document.getElementById('admin-prices-tbody');
    tbody.innerHTML = '';
    state.materials.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700; color:#0f172a; display:flex; align-items:center; gap:8px;">
          <span style="width:10px; height:10px; border-radius:50%; background:${m.conamaColor}; display:inline-block;"></span>
          <span>${m.name}</span>
        </td>
        <td>
          <span style="font-size:0.65rem; font-family:monospace; background:#f1f5f9; padding:2px 6px; border-radius:4px;">${m.category}</span>
        </td>
        <td style="text-align:right; font-weight:700; color:#047857;">R$ ${m.pricePerKg.toFixed(2)}</td>
        <td style="text-align:right; font-weight:700; color:#0284c7;">${m.co2Factor.toFixed(2)} kg CO₂</td>
        <td style="text-align:center;">
          <button class="btn btn-sm btn-secondary" onclick="openEditMaterialModal('${m.id}')">
            ✏️ Editar Valores
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.openEditMaterialModal = function (matId) {
    const m = state.materials.find(item => item.id === matId);
    if (!m) return;
    const newPrice = prompt(`Informe o novo preço (R$/kg) para ${m.name}:`, m.pricePerKg.toFixed(2));
    if (newPrice !== null) {
      const parsed = parseFloat(newPrice);
      if (!isNaN(parsed) && parsed >= 0) {
        m.pricePerKg = parsed;
        saveState();
        renderAdminPrices();
        alert(`Valor atualizado com sucesso para R$ ${parsed.toFixed(2)}/kg!`);
      }
    }
  };

  function renderAdminAudit() {
    const tbody = document.getElementById('admin-audit-tbody');
    tbody.innerHTML = '';
    document.getElementById('admin-audit-count').textContent = `Total: ${state.despachos.length} registros auditados`;

    state.despachos.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family:monospace; font-weight:700; color:#0284c7; white-space:nowrap; cursor:pointer;" onclick="openCertificateModal('${d.id}')">
          ${d.id}
        </td>
        <td style="color:#64748b; white-space:nowrap;">${d.timestamp}</td>
        <td style="font-weight:600; color:#0f172a;">${d.userName}</td>
        <td style="color:#475569;">${d.ecopontoName}</td>
        <td style="color:#334155;">${d.materialName}</td>
        <td style="text-align:right; font-weight:700; white-space:nowrap;">${d.weightKg.toFixed(1)} kg</td>
        <td style="text-align:right; font-weight:700; color:#b45309; white-space:nowrap;">R$ ${d.estimatedRevenue.toFixed(2)}</td>
        <td style="text-align:center; white-space:nowrap;">
          <span style="font-size:0.65rem; font-weight:800; background:#ecfdf5; color:#047857; padding:2px 8px; border-radius:4px;">
            ${d.status}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.exportCSV = function () {
    const headers = ['CODIGO', 'DATA_HORA', 'CIDADAO_ENTIDADE', 'ECOPONTO', 'MATERIAL', 'PESO_KG', 'CO2_EVITADO_KG', 'PONTOS', 'RENDA_GERADA_RS', 'STATUS'];
    const rows = state.despachos.map(d => [
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
    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_ecoponto_ro_${Date.now()}.csv`;
    a.click();
  };

  window.exportJSON = function () {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      project: 'EcoPonto Inteligente — Simulado Centelha 3 Rondônia',
      author: 'Ana Beatriz de Lima Rosa',
      users: state.users,
      ecopontos: state.ecopontos,
      despachos: state.despachos,
      materials: state.materials,
      campanhas: state.campanhas
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_ecoponto_ro_${Date.now()}.json`;
    a.click();
  };

  // VIEW 6: GUIA CONAMA
  function renderGuiaView() {
    const grid = document.getElementById('guia-cards-grid');
    grid.innerHTML = '';
    state.materials.forEach(m => {
      const card = document.createElement('div');
      card.className = 'main-card';
      card.style.borderTop = `4px solid ${m.conamaColor}`;
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';
      card.innerHTML = `
        <div>
          <span style="font-size:0.65rem; font-weight:800; text-transform:uppercase; color:${m.conamaColor}; display:block; margin-bottom:4px;">
            ${m.conamaName}
          </span>
          <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a;">${m.name}</h4>
          <p style="font-size:0.75rem; color:#475569; margin-top:6px; line-height:1.5;">${m.description}</p>

          <div style="margin-top:14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px; font-size:0.75rem; color:#334155;">
            <strong style="color:#0f172a; display:block; margin-bottom:4px;">🧼 Como preparar:</strong>
            ${m.howToPrepare}
          </div>
        </div>

        <div style="margin-top:18px; padding-top:12px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.75rem; font-weight:700; color:#047857;">
            Evita aprox. ${m.co2Factor} kg CO₂/kg
          </span>
          <button class="btn btn-primary btn-sm" onclick="prepareDespachoForMaterial('${m.id}')">
            Despachar Este
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  window.prepareDespachoForMaterial = function (matId) {
    switchTab('novo-despacho');
    const select = document.getElementById('despacho-material-select');
    if (select) {
      select.value = matId;
      updateDespachoLiveCalc();
    }
  };

  // VIEW 7: INDICADORES RO
  function renderIndicadoresView() {
    const metrics = getMetrics();
    document.getElementById('kpi-total-network').textContent = `${metrics.totalWeight} kg`;
    document.getElementById('kpi-user-personal').textContent = `${metrics.userWeight} kg`;
    document.getElementById('kpi-user-co2').textContent = `🌱 ${metrics.userCo2} kg CO₂ evitado`;
    document.getElementById('kpi-active-points').textContent = state.ecopontos.length;
  }

  // VIEW 8: CAMPANHAS
  function renderCampanhasView() {
    const grid = document.getElementById('campanhas-cards-grid');
    grid.innerHTML = '';
    state.campanhas.forEach(c => {
      const card = document.createElement('div');
      card.className = 'main-card';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';
      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.7rem; font-weight:700; color:#64748b;">${c.entity}</span>
            <span style="font-size:0.65rem; font-weight:800; background:#ecfdf5; color:#047857; padding:2px 8px; border-radius:4px;">
              ${c.status}
            </span>
          </div>

          <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin-top:8px;">${c.title}</h4>
          <p style="font-size:0.75rem; color:#475569; margin-top:6px; line-height:1.5;">${c.description}</p>

          <div class="meter-box" style="margin-top:16px;">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; color:#0f172a;">
              <span>Meta de Arrecadação:</span>
              <strong style="color:#047857;">${c.currentKg} de ${c.targetKg} kg (${c.progressPercent}%)</strong>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width:${c.progressPercent}%;"></div>
            </div>
          </div>
        </div>

        <div style="margin-top:20px;">
          <button class="btn btn-primary btn-block btn-sm" onclick="switchTab('novo-despacho')">
            Contribuir com Esta Campanha
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // VIEW 9: FICHA CENTELHA 3
  function renderFichaView() {
    // Static content already bound in HTML shell
  }

  // VIEW 10: PORTAL DE AUTH
  function renderAuthView(mode) {
    document.querySelectorAll('.auth-subview').forEach(view => {
      view.style.display = view.id === `auth-mode-${mode}` ? 'block' : 'none';
    });
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-auth-mode') === mode);
    });

    // Populate quick test accounts
    const quickContainer = document.getElementById('quick-accounts-list');
    if (quickContainer) {
      quickContainer.innerHTML = '';
      state.users.forEach(u => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `btn btn-sm ${u.id === state.currentUser.id ? 'btn-primary' : 'btn-secondary'}`;
        btn.style.textAlign = 'left';
        btn.style.flexDirection = 'column';
        btn.style.alignItems = 'flex-start';
        btn.innerHTML = `
          <strong style="font-size:0.75rem;">${u.name.split(' ')[0]}</strong>
          <span style="font-size:0.65rem; opacity:0.8;">${u.role}</span>
        `;
        btn.onclick = () => {
          state.currentUser = u;
          saveState();
          switchTab('map');
        };
        quickContainer.appendChild(btn);
      });
    }
  }

  window.switchAuthMode = function (mode) {
    renderAuthView(mode);
  };

  window.handleRegisterSubmit = function (e) {
    e.preventDefault();
    alert('Cadastro realizado com sucesso! Bônus de 50 Pontos Verdes creditados em sua conta.');
    state.currentUser.points += 50;
    saveState();
    switchTab('map');
  };

  window.handleRecoverSubmit = function (e) {
    e.preventDefault();
    alert('Código 2026 validado! Senha redefinida com sucesso.');
    renderAuthView('login');
  };

  // CERTIFICATE MODAL
  window.openCertificateModal = function (despachoId) {
    const d = state.despachos.find(item => item.id === despachoId);
    if (!d) return;

    const modal = document.getElementById('certificate-modal');
    document.getElementById('cert-code').textContent = d.id;
    document.getElementById('cert-user-name').textContent = d.userName;
    document.getElementById('cert-ecoponto').textContent = d.ecopontoName;
    document.getElementById('cert-material').textContent = d.materialName;
    document.getElementById('cert-weight').textContent = `${d.weightKg.toFixed(1)} kg`;
    document.getElementById('cert-co2').textContent = `-${d.co2AvoidedKg.toFixed(2)} kg CO₂e evitado`;
    document.getElementById('cert-points').textContent = `+${d.pointsEarned} PTS`;
    document.getElementById('cert-hash').textContent = `Hash: ${d.hashAudit || 'a9f24c8b7e1903e1'}`;

    modal.style.display = 'flex';
  };

  window.closeCertificateModal = function () {
    document.getElementById('certificate-modal').style.display = 'none';
  };

  window.printCertificate = function () {
    window.print();
  };

  // INITIAL BOOT
  window.addEventListener('DOMContentLoaded', () => {
    updateHeaderStats();
    switchTab('map');
  });
})();
