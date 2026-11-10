# 🌱 EcoPonto Inteligente — Coleta Seletiva Rastreável e IoT
> **Plataforma Web & Mobile de Rastreabilidade Ecológica, Telemetria IoT e Educação Cidadã**  
> **Simulado Programa Centelha 3 Rondônia (Edital nº 03/2026 — Fase 1: Ideias Inovadoras)**

[![Licença: MIT](https://img.shields.io/badge/Licença-MIT-emerald.svg)](LICENSE)
[![Edital Centelha 3](https://img.shields.io/badge/Edital_03%2F2026-Centelha_3_RO-blue.svg)](https://youtube.com/shorts/jQ7sv5xjBv8)
[![Vídeo Pitch](https://img.shields.io/badge/YouTube-Assistir_Pitch-red.svg)](https://youtube.com/shorts/jQ7sv5xjBv8)
[![Status](https://img.shields.io/badge/Status-100%25_Operacional-brightgreen.svg)](#)
[![Porta Local](https://img.shields.io/badge/Porta_Local-3011-orange.svg)](#)

---

## 👩‍💻 Informações de Autoria e Ficha Acadêmica

| Campo | Detalhe |
| :--- | :--- |
| **Projeto:** | **EcoPonto Inteligente — Coleta Seletiva Rastreável e IoT** |
| **Programa / Edital:** | Simulado Programa Centelha 3 Rondônia (Edital nº 03/2026 — Fase 1) |
| **Estudante / Autora:** | **Ana Beatriz de Lima Rosa** |
| **Turma e Curso:** | 3°B Técnico em Informática |
| **Instituição de Ensino:** | **EEEFM Carmela Dutra — Porto Velho / Rondônia** |
| **Área do Conhecimento:** | Desenvolvimento de Software, Internet das Coisas (IoT) e Ciência de Dados |
| **Setor Econômico:** | Meio ambiente, gestão de resíduos sólidos e tecnologias limpas |
| **Status do MVP:** | 100% Concluído e Operacional em `http://localhost:3011` |
| **Link do Vídeo Pitch:** | [https://youtube.com/shorts/jQ7sv5xjBv8](https://youtube.com/shorts/jQ7sv5xjBv8) |

---

## 📌 Resumo Executivo da Solução

O **EcoPonto Inteligente** foi concebido para enfrentar o gargalo estrutural diagnosticado no estado de Rondônia, onde **57,7% dos municípios não contam com serviço formal e regular de coleta seletiva** (dados oficiais do Governo de Rondônia / SINIR+).

Na capital, **Porto Velho**, a geração diária é de aproximadamente **450 a 500 toneladas de resíduos sólidos urbanos (RSU)**. A plataforma estabelece uma ponte digital auditável entre cidadãos, escolas públicas estaduais, órgãos ambientais (**SEMA Porto Velho** e **SEDAM-RO**) e as cooperativas históricas de catadores (**CATANORTE** e **ASPREVEL**).

### Principais Inovações:
1. **Geolocalização Interativa com Histórico Pessoal:** Base cartográfica de Porto Velho (destacando Rio Madeira, Av. Sete de Setembro e BR-364) com pinos de verificação onde o usuário já descartou resíduos.
2. **Telemetria IoT em Tempo Real:** Simulação de sensores ultrassônicos em recipientes com alarme visual automático ao atingir $\ge 90\%$ de capacidade e despacho de esvaziamento.
3. **Certificação Digital Auditável com QR Code:** Emissão de comprovantes com código hash exclusivo (ex: `ECO-RO-2026-001`) e suporte nativo a impressão física.
4. **Gamificação com Pontos Verdes:** Crédito de +10 pontos por kg reciclado e bônus de onboarding (+50 pontos no cadastro).
5. **Painel Governamental da SEMA:** Controle centralizado de usuários, parametrização de preços pagos a cooperativas ($R\$/kg$) e coeficientes de CO₂e evitado, além de exportação em CSV e backup em JSON.

---

## 🏛️ Dados Oficiais de Rondônia Integrados no Sistema

| Indicador / Entidade | Dado Real Integrado no Sistema | Fonte Oficial |
| :--- | :--- | :--- |
| **Defasagem Estadual de Coleta** | **57,7%** dos municípios sem serviço de coleta seletiva | Governo de RO / SINIR+ (2025) |
| **Geração de RSU em Porto Velho** | **450 a 500 toneladas/dia** | Prefeitura Municipal de Porto Velho |
| **Cooperativa Parceira 1** | **CATANORTE** — Rua da Beira, 4520, Bairro Lagoa (Porto Velho) | Associação de Catadores de RO |
| **Cooperativa Parceira 2** | **ASPREVEL** — Av. dos Imigrantes, 4100, São Sebastião | Cooperativa de Catadores de RO |
| **Ponto Escolar Sustentável** | **EEEFM Carmela Dutra** — Av. Farquar, 2550, Panair (CEP 76801-329) | SEDUC-RO |
| **Ponto Eletrônico Estadual** | **SEDAM / Palácio Rio Madeira** — Av. Farquar, 2986, Pedrinhas | SEDAM-RO |
| **Ecoponto Central do Interior** | **SEMAM Ji-Paraná** — Av. Marechal Rondon, 890, Centro | Prefeitura de Ji-Paraná |
| **Valor das Latas de Alumínio** | **R$ 6,80 / kg** (líder mundial com 98,7% de reciclagem) | ABAL / Recicla Latas |
| **Impacto Climático do Alumínio** | Evita **9,13 kg de CO₂e** por kg reciclado (95% menos energia) | Inventário Nacional MMA / IPEA |

---

## 🖥️ Catálogo Completo das 15 Telas do Sistema

- **Tela 01 — Mapa Interativo & Meus Despachos:** Base cartográfica com visualização dos ecopontos da rede (verdes) e ecopontos com despacho verificado da usuária (azuis). Inspetor lateral com telemetria em tempo real.
- **Tela 02 — Rede de Ecopontos e Cooperativas:** Listagem em cards responsivos com filtros por material (Plásticos, Papel, Vidros, Metais, Eletrônicos, Óleo) e barra de progresso da capacidade IoT.
- **Tela 03 — Histórico de Despachos & Comprovantes:** Tabela auditável pessoal com listagem de entregas, peso, CO₂ evitado, pontos verdes e botão direto para o Certificado Digital.
- **Tela 04 — Registrar Despacho de Resíduos:** Formulário completo com cálculo reativo em tempo real de pontos (+10 pts/kg), impacto de carbono e estimativa de renda para os catadores.
- **Tela 05 — Painel SEMA: Gestão de Usuários:** Gestão dos cadastros com alteração de perfis (Cidadão, Cooperativa, Escola, Admin) e bloqueio/desbloqueio.
- **Tela 06 — Painel SEMA: Ecopontos & Sensores IoT:** Sliders interativos de calibração da capacidade dos sensores ultrassônicos e botão de esvaziamento de emergência.
- **Tela 07 — Painel SEMA: Preços e Fatores de CO₂:** Parametrização econômica do valor pago por kg de cada fração e fatores de emissão evitada.
- **Tela 08 — Painel SEMA: Auditoria de Cargas & Exportação:** Livro de registros estadual com botões de Exportação CSV e Backup JSON completo.
- **Tela 09 — Guia Oficial de Descarte (Padrão CONAMA):** Cartilhas normativas com código de cores CONAMA e instruções de manuseio seguro para proteção de catadores.
- **Tela 10 — Indicadores Socioambientais de Rondônia:** Dashboard executivo com métricas consolidadas, dados do SINIR+ e metas do plano estadual.
- **Tela 11 — Campanhas Comunitárias e Escolares:** Monitoramento das metas da Gincana da Carmela Dutra, Campanha Óleo no Rio Nunca Mais e Mutirão SEDAM.
- **Tela 12 — Ficha Acadêmica do Simulado Centelha 3 (Fase 1):** Dossiê oficial da proposta acadêmica com justificativa técnica e link direto para o vídeo pitch.
- **Tela 13 — Portal de Autenticação: Login:** Interface corporativa com 4 atalhos rápidos de 1 clique para demonstração (Ana Beatriz, CATANORTE, Carmela Dutra, SEMA).
- **Tela 14 — Portal de Autenticação: Cadastro:** Abertura de conta com concessão automática de 50 Pontos Verdes.
- **Tela 15 — Portal de Autenticação: Recuperação de Senha:** Autosserviço validado com código de teste `2026`.
- **Modal Integrado — Certificado Digital:** Emissão com QR Code vetorial dinâmico, código hash e suporte a impressão via `window.print()`.

---

## ⚙️ Arquitetura Tecnológica

- **Frontend:** React 19, TypeScript 5.7, Lucide React, HTML5 Semântico, CSS3 Moderno (grid & flexbox responsivo).
- **Servidor de Produção Local:** Node.js Nativo (sem dependências externas) escutando estritamente na porta **3011** (`server.js`).
- **Banco de Dados Local (`src/db.ts`):** Relacional persistente via `localStorage` com suporte a backup JSON e exportação CSV.
- **Versionamento & Deploy:** Git, GitHub Actions para GitHub Pages (`.github/workflows/deploy.yml`).

---

## 🚀 Como Executar o Projeto Localmente

### Opção 1: Inicialização Direta com Node.js (Recomendada)
```bash
# Clone ou acerte o diretório do projeto
cd ecoponto-inteligente

# Inicie o servidor local na porta 3011
node server.js
```
Acesse no seu navegador: **`http://localhost:3011`**

### Opção 2: Via npm (Ambiente com Node e npm)
```bash
npm start
```

### Opção 3: Modo Desenvolvedor Vite (caso queira editar código com HMR)
```bash
npm run dev
```

---

## 📊 Matriz de Avaliação do Centelha 3 Rondônia

Fórmula Ponderada Oficial:
$$\text{Nota Final} = \frac{(2 \times \text{Solução}) + \text{Mercado} + \text{Impacto Socioambiental} + \text{Capacidade de Execução}}{5}$$

| Critério | Peso | Avaliação no Projeto |
| :--- | :---: | :--- |
| **Solução (S)** | Peso 2 | **100% Implementado:** Rastreabilidade por código hash, geolocalização com Rio Madeira, sensores IoT e certificação digital. |
| **Mercado (M)** | Peso 1 | **100% Implementado:** Oportunidade diagnosticada em RO (57,7%), modelo replicável para 100% das escolas estaduais da SEDUC. |
| **Impacto (I)** | Peso 1 | **100% Implementado:** Metrificação de CO₂ evitado, valorização do trabalho de cooperativas como CATANORTE e ASPREVEL. |
| **Execução (E)** | Peso 1 | **100% Implementado:** MVP completamente funcional e auditável na porta 3011, tipado em TypeScript e pitch no YouTube. |

---

## 📄 Licença

Este projeto foi desenvolvido como trabalho individual acadêmico por **Ana Beatriz de Lima Rosa** (3°B Informática — EEEFM Carmela Dutra) no âmbito do Simulado do Edital nº 03/2026 do Programa Centelha 3 Rondônia. Distribuído sob a licença MIT.
