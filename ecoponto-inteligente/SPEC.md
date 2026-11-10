# ESPECIFICAÇÃO TÉCNICA E ARQUITETURAL FINAL (SPEC)
## EcoPonto Inteligente — Coleta Seletiva Rastreável e IoT
### Simulado Programa Centelha 3 Rondônia (Edital nº 03/2026 — Fase 1: Ideias Inovadoras)

---

## 1. Identificação do Projeto e Autoria

| Atributo | Especificação Oficial |
| :--- | :--- |
| **Título do Projeto:** | EcoPonto Inteligente — Coleta Seletiva Rastreável e IoT |
| **Programa de Fomento:** | Simulado Programa Centelha 3 Rondônia (Edital nº 03/2026) |
| **Fase do Edital:** | Fase 1: Ideias Inovadoras |
| **Estudante / Autora:** | Ana Beatriz de Lima Rosa |
| **E-mail Institucional:** | anabeatriz@escola.ro.gov.br |
| **Turma e Curso:** | 3°B Técnico em Informática |
| **Instituição de Ensino:** | Escola Estadual de Ensino Fundamental e Médio Carmela Dutra |
| **Município / Estado:** | Porto Velho — Rondônia (CEP 76801-329) |
| **Área do Conhecimento:** | Desenvolvimento de Software, Internet das Coisas (IoT) e Ciência de Dados |
| **Setor Econômico Alvo:** | Meio ambiente, gestão de resíduos sólidos urbanos e tecnologias limpas |
| **Ambiente de Execução:** | Servidor Local dedicado na porta 3011 (`http://localhost:3011`) |
| **Link do Vídeo Pitch:** | [https://youtube.com/shorts/jQ7sv5xjBv8](https://youtube.com/shorts/jQ7sv5xjBv8) |
| **Repositório GitHub:** | `https://github.com/anabeatrizdelimarosa-cell/ecoponto-inteligente` |

---

## 2. Sumário Executivo & Diagnóstico Territorial de Rondônia

### 2.1 Contexto e Evidências do Problema
O estado de Rondônia enfrenta um cenário crítico na destinação final de resíduos sólidos urbanos:
- **57,7% dos municípios de Rondônia não possuem serviço regular de coleta seletiva estruturada**, conforme dados consolidados no Sistema Nacional de Informações sobre Saneamento e Resíduos (SINIR+) e pelo Governo do Estado de Rondônia (2025).
- Na capital, **Porto Velho**, a geração diária é de **450 a 500 toneladas de resíduos**, saturando os canais tradicionais de descarte e aumentando a sobrecarga ambiental na bacia do **Rio Madeira**.
- Cooperativas históricas de catadores, tais como a **CATANORTE** (Bairro Lagoa) e a **ASPREVEL** (Bairro São Sebastião), operam sem ferramentas tecnológicas de previsão de volume, rastreabilidade de procedência ou precificação transparente.
- A população e a comunidade escolar (a exemplo dos estudantes da EEEFM Carmela Dutra) não possuem canais digitais interativos para verificar o status de lotação dos recipientes antes de se deslocarem para o descarte.

### 2.2 Proposta de Valor da Solução
O **EcoPonto Inteligente** soluciona esse gargalo ao integrar em uma plataforma unificada:
1. **Rastreabilidade Ponta a Ponta:** Cada quilo de resíduo entregue por cidadãos ou escolas recebe um código hash auditável único (ex: `ECO-RO-2026-001`).
2. **Telemetria IoT em Tempo Real:** Sensores ultrassônicos medem a volumetria interna dos contêineres e alertam a SEMA Porto Velho quando a ocupação atinge $\ge 90\%$.
3. **Certificação Digital Auditável:** Emissão instantânea de comprovante com QR Code dinâmico e suporte a impressão física para comprovação de ESG e créditos escolares.
4. **Gamificação Cidadã com Pontos Verdes:** Recompensa de 10 pontos por kg reciclado e 50 pontos no onboarding.
5. **Auditoria Governamental Centralizada:** Dashboard restrito à Secretaria Municipal de Meio Ambiente (SEMA) com exportação em CSV e backup em JSON.

---

## 3. Matriz de Alinhamento com o Edital Centelha 3 Rondônia

Fórmula Ponderada Oficial do Edital Centelha 3 (Fase 1):
$$\text{Nota Final} = \frac{(2 \times \text{Solução}) + \text{Mercado} + \text{Impacto Socioambiental} + \text{Capacidade de Execução}}{5}$$

| Pilar Avaliado | Peso | Requisitos Observados pela Banca | Implementação no EcoPonto Inteligente |
| :--- | :---: | :--- | :--- |
| **Solução (S)** | **Peso 2** | Clareza da proposta, grau de inovação tecnológica, integração de sensores IoT e viabilidade prática. | **100% Implementado:** Rastreabilidade por código hash, mapa interativo georreferenciado com detecção de onde o usuário já descartou, telemetria ultrassônica IoT com slider interativo e emissão de certificados digitais com QR Code. |
| **Mercado (M)** | **Peso 1** | Oportunidade diagnosticada, demanda das cooperativas e modelo replicável para a rede pública. | **100% Implementado:** Foco no déficit de 57,7% dos municípios de RO; modelo testado na EEEFM Carmela Dutra com capacidade de replicação para as 380+ escolas estaduais da SEDUC-RO. |
| **Impacto (I)** | **Peso 1** | Metrificação de CO₂e evitado, geração de renda para catadores e desvio de aterros e lixões. | **100% Implementado:** Painel de indicadores climáticos reais (ex: 9,13 kg CO₂e/kg para latas de alumínio e R$ 6,80/kg), cálculo dinâmico de renda gerada para a CATANORTE e prevenção de contaminação da calha do Rio Madeira. |
| **Execução (E)** | **Peso 1** | Domínio técnico do estudante, maturidade do protótipo funcional e clareza no vídeo pitch. | **100% Implementado:** Proposta desenvolvida individualmente por aluna do curso técnico de informática, código tipado e modular, servidor local ativo na porta 3011 e pitch publicado no YouTube. |

---

## 4. Arquitetura Técnica do Sistema

### 4.1 Pilha Tecnológica (Tech Stack)
- **Frontend Framework:** React 19 com TypeScript 5.7 em arquitetura de componentes modulares e desacoplados.
- **Estilização e Responsividade:** CSS3 Moderno com variáveis semânticas, layouts em CSS Grid e Flexbox, tipografia otimizada e regras de mídia `@media print` para certificados em folha A4.
- **Servidor Local Dedicado:** Node.js Nativo (`server.js`) configurado estritamente na porta **3011** (`http://localhost:3011`), com tratamento de rotas SPA e zero dependências de rede em tempo de execução.
- **Build Tool:** Vite 8 com Hot Module Replacement configurado em `vite.config.ts`.
- **Motor de Banco de Dados Local (`src/db.ts`):** Estrutura relacional persistente com abstração sobre `localStorage`, suportando validações de integridade, exportação CSV e backup JSON.

### 4.2 Diagrama Arquitetural de Componentes

```
+-------------------------------------------------------------------+
|                     ECOPONTO INTELIGENTE                         |
+-------------------------------------------------------------------+
|                                                                   |
|   +-----------------------+              +---------------------+  |
|   |  Cidadão / Estudante  |              | SEMA / Cooperativas |  |
|   +-----------+-----------+              +----------+----------+  |
|               |                                     |             |
|   +-----------v-------------------------------------v----------+  |
|   |             Interface do Usuário (React 19 / TS)           |  |
|   |  - Mapa Interativo RO     - Catálogo CONAMA de Triagem     |  |
|   |  - Formulário de Despacho - Painel Administrativo SEMA     |  |
|   |  - Emissor de Certificado - Dossiê Centelha 3 & Pitch      |  |
|   +---------------------------+--------------------------------+  |
|                               |                                   |
|   +---------------------------v--------------------------------+  |
|   |       Camada de Lógica & Telemetria IoT (src/db.ts)        |  |
|   |  - Simulação Ultrassônica - Alerta Automático (>90% Cheio) |  |
|   |  - Algoritmo CO₂e Evitado - Pontuação (+10 pts/kg)         |  |
|   +---------------------------+--------------------------------+  |
|                               |                                   |
|   +---------------------------v--------------------------------+  |
|   |      Persistência Local Relacional (localStorage Engine)   |  |
|   |  - Tabela Usuários        - Tabela Ecopontos & Telemetria  |  |
|   |  - Tabela Despachos       - Tabela Materiais & Preços      |  |
|   +------------------------------------------------------------+  |
+-------------------------------------------------------------------+
```

---

## 5. Dicionário de Dados e Modelo Entidade-Relacionamento

### 5.1 Entidade: Usuários (`User`)
- `id` (string, PK): Identificador unívoco do usuário (ex: `user-ana`).
- `name` (string): Nome completo da pessoa física ou razão social da instituição.
- `email` (string): Endereço de correio eletrônico corporativo ou educacional.
- `role` (enum): Nível de acesso (`CIDADAO`, `COOPERATIVA`, `ESCOLA`, `ADMIN`).
- `points` (number): Saldo acumulado de Pontos Verdes.
- `status` (enum): Condição da conta (`Ativo` ou `Bloqueado`).
- `location` (string): Vínculo territorial ou educacional (ex: `3°B Informática – EEEFM Carmela Dutra`).
- `document` (string): CPF do cidadão ou CNPJ da entidade cooperada.
- `phone` (string, opcional): Contato de telefone ou WhatsApp.

### 5.2 Entidade: Ecopontos e Cooperativas (`Ecoponto`)
- `id` (string, PK): Identificador do ponto de entrega (ex: `eco-catanorte`).
- `name` (string): Nome oficial do ecoponto ou cooperativa de triagem.
- `category` (string): Classificação (`Ecoponto Municipal`, `Cooperativa de Catadores`, `Ponto Escolar`, `Ponto Governamental`).
- `address` (string): Logradouro completo, número e bairro.
- `municipio` (string): Município de Rondônia (Porto Velho ou Ji-Paraná).
- `lat` (number): Latitude WGS84 em graus decimais (ex: `-8.7595`).
- `long` (number): Longitude WGS84 em graus decimais (ex: `-63.9012`).
- `capacityKg` (number): Capacidade volumétrica nominal do recipiente em quilogramas.
- `currentKg` (number): Peso estimado ocupado no momento.
- `iotPercent` (number): Leitura percentual simulada dos sensores de $0\%$ a $100\%$.
- `status` (string): Status operacional (`Ativo`, `Manutenção`, `Lotado`).
- `materialsAccepted` (string[]): Relação de frações aceitas para triagem.
- `userDeliveriesCount` (number): Contador de entregas feitas pelo usuário logado.

### 5.3 Entidade: Despachos e Comprovantes (`Despacho`)
- `id` (string, PK): Código alfanumérico do certificado (ex: `ECO-RO-2026-001`).
- `timestamp` (string): Carimbo temporal no formato `AAAA-MM-DD HH:MM`.
- `userId` (string, FK): Referência ao usuário que realizou a entrega.
- `userName` (string): Nome do titular registrado no comprovante.
- `ecopontoId` (string, FK): Ponto receptor da carga.
- `materialName` (string): Descrição do material segundo a classificação CONAMA.
- `category` (enum): Família do material (`PLASTICO`, `PAPEL`, `VIDRO`, `METAL`, `ELETRONICO`, `OLEO`).
- `weightKg` (number): Peso verificado na balança em quilogramas.
- `co2AvoidedKg` (number): Volume de emissões de carbono poupadas.
- `pointsEarned` (number): Pontos Verdes creditados ($\text{Peso} \times 10$).
- `estimatedRevenue` (number): Renda financeira gerada para o catador ($\text{Peso} \times \text{Preço/kg}$).
- `status` (string): Validação da carga (`VALIDADO NO ECOPONTO`).
- `notes` (string, opcional): Observações sobre o lote entregue.
- `hashAudit` (string): Código hash hexadecimal para verificação de autenticidade.

### 5.4 Entidade: Materiais e Fatores de Emissão (`MaterialInfo`)
- Preços oficiais pagos por quilo aos catadores de Rondônia e fatores de emissão evitada:
  1. **Plásticos (PET, PEAD, PEBD, PP):** R$ 2,40 / kg | 1,53 kg CO₂e/kg evitado.
  2. **Papel, Papelão e Embalagens Longa Vida:** R$ 0,65 / kg | 0,92 kg CO₂e/kg evitado.
  3. **Vidros (Garrafas, Potes de Conserva e Frascos):** R$ 0,35 / kg | 0,31 kg CO₂e/kg evitado.
  4. **Metais e Alumínio (Latinhas e Sucata Nobre):** R$ 6,80 / kg | 9,13 kg CO₂e/kg evitado (líder nacional em reciclagem com 98,7%).
  5. **Resíduos Eletroeletrônicos (E-Lixo / Logística Reversa):** R$ 4,80 / kg | 4,80 kg CO₂e/kg evitado.
  6. **Óleo Vegetal de Fritura Usado:** R$ 2,45 / kg | 2,45 kg CO₂e/kg evitado (proteção da calha do Rio Madeira).

---

## 6. Módulo de Telemetria de Sensores IoT

### 6.1 Princípio de Operação dos Sensores
O módulo IoT simula a leitura contínua de sensores de distância ultrassônicos (compatíveis com módulos industriais ou modelos didáticos como HC-SR04 acoplados a microcontroladores ESP32 com conectividade LoRaWAN/Wi-Fi):
- O sensor é posicionado no teto superior do contêiner de coleta seletiva e emite pulsos de ondas de alta frequência em direção ao topo da pilha de materiais descartados.
- O tempo de eco de retorno define a distância livre $D_{\text{livre}}$ até o topo dos materiais.
- Conhecendo a altura útil interna do recipiente $H_{\text{total}}$, calcula-se a taxa de ocupação:
$$\text{Ocupação (\%)} = \left( 1 - \frac{D_{\text{livre}}}{H_{\text{total}}} \right) \times 100$$

### 6.2 Regra de Disparo de Lotação Crítica
- Quando o percentual atinge **90% ou mais**:
  - O status do ecoponto no banco de dados comuta imediatamente de `Ativo` para `Lotado`.
  - A interface gráfica dispara um alerta visual piscante na cor vermelha: `⚠️ ALERTA: RECIPIENTE LOTADO (>90%)`.
  - É habilitado o botão administrativo `🚚 Disparar Esvaziamento Coleta SEMA`, que simula a ordem de serviço emitida para os caminhões de recolhimento da prefeitura ou da cooperativa.

---

## 7. Sistema de Rastreabilidade e Certificação com QR Code

### 7.1 Regras de Concessão de Pontos Verdes
- A cada despacho aprovado, o cidadão ou escola recebe:
$$\text{Pontos Concedidos} = \text{round}(\text{Peso em kg} \times 10)$$
- No momento do primeiro cadastro no sistema, é concedido um **bônus de acolhimento de +50 Pontos Verdes**.

### 7.2 Emissão do Certificado Digital
O comprovante de entrega é formatado como uma apólice ecológica oficial, exibindo:
- Código de rastreabilidade único no formato padronizado: `ECO-RO-2026-XXX`.
- Identificação do cidadão/estudante titular e seu documento.
- Nome e endereço do ecoponto ou cooperativa receptora.
- Discriminação exata do material e peso aferido.
- Cálculo de CO₂e evitado e renda estimada para os catadores.
- Código de verificação hash de 16 caracteres hexadecimais.
- **QR Code dinâmico em vetor SVG**, permitindo leitura por câmeras de dispositivos móveis.
- Compatibilidade nativa com impressão física através da folha de estilos `@media print`.

---

## 8. Especificação Funcional das 15 Telas do Catálogo Visual

1. **Tela 01 — Mapa Interativo & Meus Despachos (Geolocalização / Cidadão):**
   Renderiza a base cartográfica de Rondônia destacando o Rio Madeira, Av. Sete de Setembro e Av. Rio Madeira (BR-364). Mostra pinos verdes para a rede e pinos azuis com selo de verificação onde Ana Beatriz já realizou despachos. Inspetor lateral com telemetria em tempo real.
2. **Tela 02 — Rede de Ecopontos e Cooperativas (Localização & Telemetria):**
   Cards de todos os pontos credenciados (SEMA, CATANORTE, ASPREVEL, EEEFM Carmela Dutra, SEDAM, SEMAM Ji-Paraná), com busca textual, filtros por material aceito e barra de progresso da capacidade.
3. **Tela 03 — Histórico de Despachos & Comprovantes (Rastreabilidade Pessoal):**
   Tabela completa de prestação de contas da usuária com dados, peso, CO₂ evitado, pontos e botão direto para abrir o Certificado Digital com QR Code.
4. **Tela 04 — Registrar Despacho de Resíduos (Operação de Entrega):**
   Formulário com seletor de ecoponto, seletor de material, campo de peso e cálculo imediato reativo de pontos, CO₂e e renda dos catadores.
5. **Tela 05 — Painel Administrativo: Gestão de Usuários (SEMA):**
   Área restrita de gestão municipal para consultar os usuários da malha, alterar papéis de acesso (Cidadão, Cooperativa, Escola, Admin) e bloquear/desbloquear cadastros.
6. **Tela 06 — Painel Administrativo: Ecopontos & Sensores IoT:**
   Controle dos recipientes físicos com sliders interativos de telemetria ultrassônica e botão de esvaziamento de emergência.
7. **Tela 07 — Painel Administrativo: Preços e Fatores de CO₂:**
   Tabela paramétrica dos 6 grupos de materiais recicláveis com edição em tempo real dos valores de compra aos catadores e fatores climáticos.
8. **Tela 08 — Painel Administrativo: Auditoria de Cargas & Exportação:**
   Livro de registros estadual com botões de Exportação CSV imediata e Backup JSON integral para prestação de contas ao Centelha 3.
9. **Tela 09 — Guia Oficial de Descarte (Padrão CONAMA):**
   Cartilha educativa com cores normativas CONAMA (Vermelho, Azul, Verde, Amarelo, Laranja, Âmbar) e orientações técnicas de segurança no manuseio.
10. **Tela 10 — Indicadores Socioambientais de Rondônia:**
    Painel de business intelligence com total reciclado na rede (64,2 kg), impacto pessoal (31,7 kg / 55,9 kg CO₂), defasagem em RO (57,7%) e quantidade de ecopontos ativos (6).
11. **Tela 11 — Campanhas Comunitárias e Escolares:**
    Monitoramento de metas de arrecadação da Gincana da Turma 3°B da Carmela Dutra, Campanha Óleo no Rio Nunca Mais e Mutirão SEDAM.
12. **Tela 12 — Ficha Acadêmica do Simulado Centelha 3 (Fase 1):**
    Dossiê institucional completo da aluna Ana Beatriz de Lima Rosa, evidências do SINIR+, matriz de avaliação e link direto para o vídeo pitch no YouTube.
13. **Tela 13 — Portal de Autenticação: Tela de Login:**
    Interface corporativa com botões de acesso rápido em 1 clique para demonstração (Ana Beatriz, Cooperativa CATANORTE, Carmela Dutra, SEMA).
14. **Tela 14 — Portal de Autenticação: Tela de Cadastro:**
    Formulário completo com campos de perfil, CPF/CNPJ, município em RO e crédito de 50 pontos de bônus de abertura.
15. **Tela 15 — Portal de Autenticação: Recuperação de Senha:**
    Autosserviço com código pré-configurado de demonstração `2026`.
- **Modal Integrado:** Certificado Digital com QR Code auditável e botão de impressão física.

---

## 9. Guia de Implantação e Execução

### 9.1 Execução do Servidor Local na Porta 3011
O sistema possui servidor Node.js nativo sem dependências de pacotes externos, permitindo execução imediata:
```bash
# Navegar até o diretório do projeto
cd C:\Users\Aluno\.gemini\antigravity\scratch\ecoponto-inteligente

# Inicializar o servidor nativo na porta 3011
node server.js
```
Acesse no navegador: **`http://localhost:3011`**

### 9.2 Controle de Versão e GitHub
O repositório Git local foi inicializado na branch principal `main` e vinculado à origem remota:
```bash
git remote add origin https://github.com/anabeatrizdelimarosa-cell/ecoponto-inteligente.git
```
O fluxo de CI/CD para GitHub Pages está estruturado em `.github/workflows/deploy.yml`.

---

## 10. Conclusão da Especificação

Esta Especificação Técnica Final (SPEC) atesta a completude, viabilidade técnica e impacto social do projeto **EcoPonto Inteligente — Coleta Seletiva Rastreável e IoT**, comprovando a capacidade de execução de **Ana Beatriz de Lima Rosa** no cumprimento de todas as diretrizes do **Edital nº 03/2026 do Programa Centelha 3 Rondônia**.
