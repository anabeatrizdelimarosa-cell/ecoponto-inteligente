import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
const secret = process.env.JWT_SECRET || 'desenvolvimento-nao-usar-em-producao';

function auth(req: any, res: any, next: any) {
 const header = req.headers.authorization;
 if (!header?.startsWith('Bearer ')) return res.status(401).json({ erro: 'Faça login para continuar.' });
 try { req.user = jwt.verify(header.slice(7), secret); next(); }
 catch { return res.status(401).json({ erro: 'Sessão inválida ou expirada.' }); }
}
function admin(req: any, res: any, next: any) {
 if (req.user?.tipo !== 'admin') return res.status(403).json({ erro: 'Acesso permitido somente ao administrador.' });
 next();
}
app.get('/api/health', (_req, res) => res.json({ status: 'ok', sistema: 'EcoPonto Inteligente' }));

app.post('/api/auth/register', async (req, res) => {
 try {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha || senha.length < 6) return res.status(400).json({ erro: 'Informe nome, e-mail e senha com pelo menos 6 caracteres.' });
  const hash = await bcrypt.hash(senha, 12);
  const result = await pool.query('INSERT INTO usuarios (nome,email,senha_hash) VALUES ($1,$2,$3) RETURNING id,nome,email,tipo', [nome.trim(), email.toLowerCase().trim(), hash]);
  res.status(201).json(result.rows[0]);
 } catch (e: any) { res.status(400).json({ erro: e.code === '23505' ? 'Este e-mail já está cadastrado.' : 'Não foi possível criar a conta.' }); }
});
app.post('/api/auth/login', async (req, res) => {
 const { email, senha } = req.body;
 const r = await pool.query('SELECT * FROM usuarios WHERE email=$1 AND ativo=true', [String(email || '').toLowerCase().trim()]);
 if (!r.rowCount || !(await bcrypt.compare(senha || '', r.rows[0].senha_hash))) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
 const u = r.rows[0]; const token = jwt.sign({ id: u.id, nome: u.nome, tipo: u.tipo }, secret, { expiresIn: '8h' });
 res.json({ token, usuario: { id: u.id, nome: u.nome, email: u.email, tipo: u.tipo } });
});
app.get('/api/me', auth, async (req: any, res) => res.json(req.user));

app.get('/api/materiais', async (_req, res) => {
 const r = await pool.query('SELECT id,nome,descricao,orientacao_descarte FROM materiais WHERE ativo=true ORDER BY nome'); res.json(r.rows);
});
app.post('/api/materiais', auth, admin, async (req, res) => {
 const { nome, descricao, orientacao_descarte } = req.body;
 if (!nome || !orientacao_descarte) return res.status(400).json({ erro: 'Nome e orientação são obrigatórios.' });
 const r = await pool.query('INSERT INTO materiais(nome,descricao,orientacao_descarte) VALUES($1,$2,$3) RETURNING *', [nome, descricao || '', orientacao_descarte]); res.status(201).json(r.rows[0]);
});
app.get('/api/pontos', async (req, res) => {
 const material = req.query.material;
 const params: any[] = [];
 let sql = `SELECT p.*, COALESCE(json_agg(json_build_object('id',m.id,'nome',m.nome)) FILTER (WHERE m.id IS NOT NULL),'[]') AS materiais FROM pontos_coleta p LEFT JOIN ponto_materiais pm ON pm.ponto_id=p.id LEFT JOIN materiais m ON m.id=pm.material_id WHERE p.status='ativo'`;
 if (material) { params.push(Number(material)); sql += ` AND EXISTS (SELECT 1 FROM ponto_materiais x WHERE x.ponto_id=p.id AND x.material_id=$${params.length})`; }
 sql += ' GROUP BY p.id ORDER BY p.nome'; const r = await pool.query(sql, params); res.json(r.rows);
});
app.post('/api/pontos', auth, admin, async (req, res) => {
 const { nome, descricao, endereco, latitude, longitude, capacidade, materiais=[] } = req.body;
 if (!nome || !endereco) return res.status(400).json({ erro: 'Nome e endereço são obrigatórios.' });
 const c = await pool.connect();
 try { await c.query('BEGIN'); const p = await c.query('INSERT INTO pontos_coleta(nome,descricao,endereco,latitude,longitude,capacidade) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',[nome,descricao||'',endereco,latitude||null,longitude||null,capacidade||null]);
 for (const id of materiais) await c.query('INSERT INTO ponto_materiais(ponto_id,material_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[p.rows[0].id,id]); await c.query('COMMIT'); res.status(201).json(p.rows[0]);
 } catch { await c.query('ROLLBACK'); res.status(400).json({ erro: 'Não foi possível cadastrar o ponto.' }); } finally { c.release(); }
});
app.post('/api/entregas', auth, async (req: any, res) => {
 const { ponto_id, material_id, quantidade, unidade='kg' } = req.body;
 if (!ponto_id || !material_id || !Number.isFinite(Number(quantidade)) || Number(quantidade)<=0) return res.status(400).json({ erro: 'Preencha ponto, material e quantidade maior que zero.' });
 const valid = await pool.query("SELECT 1 FROM pontos_coleta p JOIN ponto_materiais pm ON pm.ponto_id=p.id WHERE p.id=$1 AND p.status='ativo' AND pm.material_id=$2",[ponto_id,material_id]);
 if (!valid.rowCount) return res.status(400).json({ erro: 'O ponto selecionado não recebe esse material.' });
 const r = await pool.query('INSERT INTO entregas(usuario_id,ponto_id,material_id,quantidade,unidade) VALUES($1,$2,$3,$4,$5) RETURNING *',[req.user.id,ponto_id,material_id,quantidade,unidade]); res.status(201).json(r.rows[0]);
});
app.get('/api/entregas/minhas', auth, async (req: any, res) => {
 const r = await pool.query(`SELECT e.id,e.quantidade,e.unidade,e.data_entrega,p.nome AS ponto,m.nome AS material FROM entregas e JOIN pontos_coleta p ON p.id=e.ponto_id JOIN materiais m ON m.id=e.material_id WHERE e.usuario_id=$1 ORDER BY e.data_entrega DESC`,[req.user.id]); res.json(r.rows);
});
app.get('/api/indicadores', auth, async (req: any, res) => {
 const filtro = req.user.tipo === 'admin' ? '' : 'WHERE usuario_id=$1'; const args = filtro ? [req.user.id] : [];
 const total = await pool.query(`SELECT COALESCE(SUM(quantidade),0) AS quantidade,COUNT(*) AS entregas FROM entregas ${filtro}`,args);
 const materiais = await pool.query(`SELECT m.nome,COALESCE(SUM(e.quantidade),0) AS quantidade FROM materiais m LEFT JOIN entregas e ON e.material_id=m.id ${filtro ? 'AND e.usuario_id=$1' : ''} GROUP BY m.id ORDER BY quantidade DESC`,args);
 res.json({ ...total.rows[0], materiais });
});
app.get('/api/admin/entregas', auth, admin, async (_req, res) => {
 const r = await pool.query('SELECT e.*,u.nome AS usuario,p.nome AS ponto,m.nome AS material FROM entregas e JOIN usuarios u ON u.id=e.usuario_id JOIN pontos_coleta p ON p.id=e.ponto_id JOIN materiais m ON m.id=e.material_id ORDER BY e.data_entrega DESC'); res.json(r.rows);
});

const port = Number(process.env.PORT || 3333);
app.listen(port, () => console.log(`EcoPonto API em http://localhost:${port}`));
