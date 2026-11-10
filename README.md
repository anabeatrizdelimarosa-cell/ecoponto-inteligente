# EcoPonto Inteligente ♻️

Plataforma web/mobile desenvolvida para gestão, rastreabilidade e incentivo à coleta seletiva de recicláveis em Rondônia.

## 📹 Vídeo Pitch
- **Assista ao vídeo pitch do projeto:** [https://youtube.com/shorts/jQ7sv5xjBv8](https://youtube.com/shorts/jQ7sv5xjBv8)[cite: 15]

---

## 🛠️ Stack Tecnológica

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS e Lucide React.
* **Backend:** Node.js, TypeScript e Express (API REST)[cite: 15].
* **Banco de Dados:** PostgreSQL com suporte a armazenamento local no frontend para o MVP[cite: 15].
* **Autenticação:** Sistema de perfis (Cidadão, Cooperativa, Escola, SEMA) com hash de senha e sessão.

---

## ✨ Funcionalidades Implementadas

* **Mapa Interativo & Geolocalização:** Destaque para ecopontos da rede e identificação dos locais onde o usuário já descartou resíduos[cite: 15].
* **Rede de Ecopontos e Cooperativas:** Card dinâmico de pontos credenciados (SEMA Porto Velho, CATANORTE, ASPREVEL, EEEFM Carmela Dutra e SEMAM Ji-Paraná) com telemetria de sensores IoT[cite: 15].
* **Histórico & Comprovantes Digitais:** Emissão de certificado com QR Code auditável (ex: `ECO-RO-2026-001`)[cite: 15].
* **Registro de Despacho:** Cálculo automático de Pontos Verdes (+10 pts/kg), pegada de CO₂ evitada e renda estimada para catadores[cite: 15].
* **Painel Administrativo Governamental (SEMA):** Controle de acessos, simulador de sensores IoT ultrassônicos, edição de parâmetros de CO₂/preços de recicláveis e exportação de relatórios em CSV e JSON[cite: 15].
* **Guia Oficial de Descarte:** Orientações padronizadas de separação de recicláveis no padrão CONAMA[cite: 15].
* **Indicadores Socioambientais & Campanhas:** Métricas estaduais integradas e acompanhamento da Gincana Sustentável escolar[cite: 15].

---

## 📋 Requisitos

* Node.js 20 ou superior[cite: 15]
* Docker Desktop (opcional, para PostgreSQL via container)[cite: 15]

---

## 🚀 Como Executar Localmente

1. **Clonar o Repositório:**
   ```bash
   git clone [https://github.com/anabeatrizdelimarosa-cell/ecoponto-inteligente.git](https://github.com/anabeatrizdelimarosa-cell/ecoponto-inteligente.git)
   cd ecoponto-inteligente
