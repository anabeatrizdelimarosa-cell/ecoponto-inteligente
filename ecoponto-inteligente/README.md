# EcoPonto Inteligente ♻️

Plataforma web/mobile desenvolvida para gestão, rastreabilidade e incentivo à coleta seletiva de resíduos recicláveis em Rondônia.

## 📹 Vídeo Pitch
- **Assista ao vídeo pitch do projeto:** [https://youtube.com/shorts/jQ7sv5xjBv8](https://youtube.com/shorts/jQ7sv5xjBv8)

---

## 🛠️ Stack Tecnológica

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS e Lucide React.
* **Backend:** Node.js, TypeScript e Express (API REST).
* **Banco de Dados:** PostgreSQL com suporte a armazenamento local no frontend via `localStorage` para o MVP.
* **Autenticação:** Sistema de perfis (Cidadão, Cooperativa, Escola, SEMA) com hash de senha e sessão.

---

## ✨ Funcionalidades Implementadas

* **Mapa Interativo & Geolocalização:** Destaque para ecopontos da rede e identificação dos locais onde o usuário já descartou resíduos.
* **Rede de Ecopontos e Cooperativas:** Card dinâmico de pontos credenciados (SEMA Porto Velho, CATANORTE, ASPREVEL, EEEFM Carmela Dutra e SEMAM Ji-Paraná) com telemetria de sensores IoT.
* **Histórico & Comprovantes Digitais:** Emissão de certificado com QR Code auditável (ex: `ECO-RO-2026-001`).
* **Registro de Despacho:** Cálculo automático de Pontos Verdes (+10 pts/kg), pegada de CO₂ evitada e renda estimada para catadores.
* **Painel Administrativo Governamental (SEMA):** Controle de acessos, simulador de sensores IoT ultrassônicos, edição de parâmetros de CO₂/preços de recicláveis e exportação de relatórios em CSV e JSON.
* **Guia Oficial de Descarte:** Orientações padronizadas de separação de recicláveis no padrão CONAMA.
* **Indicadores Socioambientais & Campanhas:** Métricas estaduais integradas e acompanhamento da Gincana Sustentável escolar.

---

## 📋 Requisitos

* Node.js 20 ou superior
* Docker Desktop (opcional, para PostgreSQL via container)

---

## 🚀 Como Executar Localmente

<Steps>
  <Step title="Clonar o Repositório" subtitle="Terminal">
    ```bash
    git clone [https://github.com/anabeatrizdelimarosa-cell/ecoponto-inteligente.git](https://github.com/anabeatrizdelimarosa-cell/ecoponto-inteligente.git)
    cd ecoponto-inteligente
    ```
    *Verification:* A pasta atual no terminal deve ser a raiz do projeto `ecoponto-inteligente`.
  </Step>
  <Step title="Instalar Dependências" subtitle="NPM">
    Instale as dependências da raiz e dos módulos:
    ```bash
    npm install
    npm install --prefix server
    npm install --prefix client
    ```
    *Verification:* A pasta `node_modules` será criada dentro da raiz, de `client` e de `server`.
  </Step>
  <Step title="Iniciar a Aplicação" subtitle="Porta 3011">
    Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    *Verification:* Acesse `http://localhost:3011` no seu navegador para visualizar a plataforma rodando.
  </Step>
</Steps>

Não envie arquivos `.env`, senhas ou chaves secretas ao GitHub.
