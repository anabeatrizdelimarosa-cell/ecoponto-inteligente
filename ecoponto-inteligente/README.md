# EcoPonto Inteligente ♻️

MVP web responsivo para orientar o descarte, consultar pontos de coleta, registrar entregas e acompanhar indicadores.

## Tecnologias
- Frontend: React, TypeScript, Vite e CSS.
- Backend: Node.js, TypeScript e Express (API REST).
- Banco: PostgreSQL.
- Autenticação: JWT e hash de senha com bcrypt.

## Funcionalidades implementadas
- Cadastro e login de usuários.
- Consulta de materiais e orientações de descarte.
- Consulta de pontos ativos e filtro por material.
- Registro de entrega com validação de campos e compatibilidade entre ponto/material.
- Histórico individual de entregas.
- Indicadores de quantidade e entregas.
- Estrutura de rotas administrativas para cadastro de materiais e pontos e consulta geral de entregas.

> A integração com sensores IoT não faz parte deste MVP, conforme a especificação inicial. O cadastro inicial de materiais é ilustrativo; pontos reais devem ser cadastrados por um administrador autorizado.

## Requisitos
Node.js 20 ou superior e Docker Desktop (ou PostgreSQL instalado).

## Como executar
1. Abra a pasta do projeto no terminal.
2. Inicie o PostgreSQL: `docker compose up -d db`.
3. Copie `server/.env.example` para `server/.env`.
4. Na raiz, instale as dependências: `npm install`, `npm install --prefix server` e `npm install --prefix client`.
5. Inicie os dois serviços: `npm run dev`.
6. Acesse `http://localhost:5173`.

A API fica em `http://localhost:3333/api` e o endpoint de teste é `/api/health`.

## Primeiro administrador
Por segurança, o cadastro público cria contas comuns. Para promover uma conta a administrador, execute no PostgreSQL, substituindo o e-mail:

```sql
UPDATE usuarios SET tipo = 'admin' WHERE email = 'seu-email@exemplo.com';
```

Depois, saia e entre novamente para atualizar o token. O administrador pode usar as rotas `POST /api/pontos` e `POST /api/materiais` com token Bearer. O corpo de cadastro de ponto aceita `nome`, `descricao`, `endereco`, `latitude`, `longitude`, `capacidade` e `materiais` (lista de IDs de materiais).

## Publicar no GitHub
Crie um repositório vazio no GitHub chamado `ecoponto-inteligente`. Na pasta do projeto, execute:

```bash
git init
git add .
git commit -m "Cria MVP do EcoPonto Inteligente"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ecoponto-inteligente.git
git push -u origin main
```

Não envie arquivos `.env`, senhas ou chaves secretas ao GitHub.
