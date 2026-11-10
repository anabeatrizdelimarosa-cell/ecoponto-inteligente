import { useEffect, useState } from 'react';
import { Recycle, MapPin, Leaf, History, LogOut, PackageCheck, BarChart3, Plus, LogIn, UserPlus, Search } from 'lucide-react';

const API = 'http://localhost:3333/api';

type User = { id: number; nome: string; email: string; tipo: string };
type Material = { id: number; nome: string; descricao: string; orientacao_descarte: string };
type Point = { id: number; nome: string; descricao: string; endereco: string; capacidade: string; materiais: { id: number; nome: string }[] };

export default function App() {
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('ecouser') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('ecotoken') || '');
  const [tab, setTab] = useState('inicio');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ quantidade: 0, entregas: 0, materiais: [] });
  const [filter, setFilter] = useState('');
  const [notice, setNotice] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState<any>({ nome: '', email: '', senha: '' });
  const [delivery, setDelivery] = useState<any>({ ponto_id: '', material_id: '', quantidade: '', unidade: 'kg' });

  const headers = () => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  });

  async function api(path: string, opts: any = {}) {
    const r = await fetch(API + path, { ...opts, headers: { ...headers(), ...(opts.headers || {}) } });
    const data = await r.json();
    if (!r.ok) throw new Error(data.erro || 'Erro na solicitação');
    return data;
  }

  async function load() {
    try {
      const [m, p] = await Promise.all([
        api('/materiais'),
        api('/pontos' + (filter ? '?material=' + filter : ''))
      ]);
      setMaterials(m);
      setPoints(p);
      if (user) {
        const [h, s] = await Promise.all([
          api('/entregas/minhas'),
          api('/indicadores')
        ]);
        setHistory(h);
        setStats(s);
      }
    } catch (e: any) {
      setNotice(e.message);
    }
  }

  useEffect(() => { load(); }, [!!user, filter]);

  async function submitAuth(e: any) {
    e.preventDefault();
    try {
      if (authMode === 'register') {
        await api('/auth/register', { method: 'POST', body: JSON.stringify(form) });
        setNotice('Conta criada! Agora entre com seu e-mail e senha.');
        setAuthMode('login');
      } else {
        const d = await api('/auth/login', { method: 'POST', body: JSON.stringify(form) });
        setToken(d.token);
        setUser(d.usuario);
        localStorage.setItem('ecotoken', d.token);
        localStorage.setItem('ecouser', JSON.stringify(d.usuario));
        setNotice('Bem-vindo(a) ao EcoPonto!');
      }
    } catch (e: any) {
      setNotice(e.message);
    }
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('ecotoken');
    localStorage.removeItem('ecouser');
    setTab('inicio');
  }

  async function saveDelivery(e: any) {
    e.preventDefault();
    try {
      await api('/entregas', { method: 'POST', body: JSON.stringify(delivery) });
      setNotice('Entrega registrada com sucesso!');
      setDelivery({ ponto_id: '', material_id: '', quantidade: '', unidade: 'kg' });
      load();
    } catch (e: any) {
      setNotice(e.message);
    }
  }

  return (
    <div className="app">
      <header>
        <div className="brand">
          <div className="brand-icon"><Recycle /></div>
          <div><b>EcoPonto</b><small>INTELIGENTE</small></div>
        </div>
        <nav>
          {[
            ['inicio', 'Início'],
            ['materiais', 'Materiais'],
            ['pontos', 'Pontos de coleta'],
            ...(user ? [['entrega', 'Registrar entrega'], ['historico', 'Meu histórico'], ['indicadores', 'Indicadores']] : [])
          ].map(([id, label]) => (
            <button className={tab === id ? 'active' : ''} onClick={() => setTab(id)} key={id}>
              {label}
            </button>
          ))}
        </nav>
        <div className="account">
          {user ? (
            <>
              <span>Olá, {user.nome.split(' ')[0]}</span>
              <button className="icon-btn" onClick={logout} title="Sair"><LogOut size={18} /></button>
            </>
          ) : (
            <button className="login-btn" onClick={() => setTab('login')}><LogIn size={16} /> Entrar</button>
          )}
        </div>
      </header>

      {notice && <div className="notice" onClick={() => setNotice('')}>{notice} <b>×</b></div>}

      <main>
        {tab === 'login' && (
          <section className="auth card">
            <div className="section-icon"><Leaf /></div>
            <h2>{authMode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}</h2>
            <p>Faça parte de uma cidade mais sustentável.</p>
            <form onSubmit={submitAuth}>
              {authMode === 'register' && (
                <input required placeholder="Nome completo" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
              )}
              <input required type="email" placeholder="E-mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input required minLength={6} type="password" placeholder="Senha (mínimo 6 caracteres)" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
              <button className="primary">{authMode === 'login' ? 'Entrar' : 'Cadastrar'}</button>
            </form>
            <button className="link" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
            </button>
          </section>
        )}

        {tab === 'inicio' && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">PEQUENAS ATITUDES, GRANDES MUDANÇAS</span>
                <h1>O futuro é mais<br /><em>verde</em> quando a gente<br />faz a nossa parte.</h1>
                <p>Encontre pontos de coleta, descubra como separar seus resíduos e acompanhe o impacto positivo das suas entregas.</p>
                <button className="primary" onClick={() => setTab(user ? 'entrega' : 'materiais')}>Começar agora <span>→</span></button>
              </div>
              <div className="hero-art">
                <div className="circle"><Recycle size={116} /></div>
                <div className="float-card">
                  <Leaf size={18} />
                  <span>Recicle hoje,<br /><b>transforme amanhã.</b></span>
                </div>
              </div>
            </section>
            <section className="features">
              <div><MapPin /><b>Encontre</b><span>Pontos de coleta próximos e materiais aceitos.</span></div>
              <div><PackageCheck /><b>Registre</b><span>Registre suas entregas de recicláveis.</span></div>
              <div><BarChart3 /><b>Acompanhe</b><span>Veja seu histórico e indicadores de reciclagem.</span></div>
            </section>
            <div className="section-heading">
              <div><span className="eyebrow">COMECE POR AQUI</span><h2>Como podemos ajudar?</h2></div>
            </div>
            <div className="quick-grid">
              <button onClick={() => setTab('materiais')}>♻️ <b>Orientação de descarte</b><span>Saiba como separar cada material.</span></button>
              <button onClick={() => setTab('pontos')}>📍 <b>Pontos de coleta</b><span>Descubra onde entregar seus resíduos.</span></button>
              <button onClick={() => setTab(user ? 'entrega' : 'login')}>📦 <b>Registrar entrega</b><span>Registre sua contribuição ambiental.</span></button>
            </div>
          </>
        )}

        {tab === 'materiais' && (
          <>
            <div className="page-title">
              <span className="eyebrow">DESCARTE CONSCIENTE</span>
              <h1>Guia de materiais</h1>
              <p>Confira as orientações para separar e encaminhar seus resíduos corretamente.</p>
            </div>
            <div className="material-grid">
              {materials.map(m => (
                <article className="card material" key={m.id}>
                  <div className="material-symbol"><Recycle /></div>
                  <h3>{m.nome}</h3>
                  <p>{m.descricao}</p>
                  <div className="tip"><b>Como descartar</b><span>{m.orientacao_descarte}</span></div>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'pontos' && (
          <>
            <div className="page-title">
              <span className="eyebrow">DESCARTE PERTO DE VOCÊ</span>
              <h1>Pontos de coleta</h1>
              <p>Consulte os locais cadastrados e veja quais materiais são aceitos.</p>
            </div>
            <div className="filter">
              <Search size={18} />
              <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="">Todos os materiais</option>
                {materials.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </div>
            <div className="point-grid">
              {points.map(p => (
                <article className="card point" key={p.id}>
                  <div className="point-top"><MapPin /><span>ATIVO</span></div>
                  <h3>{p.nome}</h3>
                  <p>{p.descricao}</p>
                  <div className="address">{p.endereco}</div>
                  <b>Materiais aceitos</b>
                  <div className="tags">
                    {p.materiais.map(m => <span key={m.id}>{m.nome}</span>)}
                  </div>
                  {p.capacidade && <small>Capacidade: {p.capacidade}</small>}
                </article>
              ))}
              {!points.length && <p>Nenhum ponto cadastrado para esse filtro.</p>}
            </div>
          </>
        )}

        {tab === 'entrega' && (
          <section className="card form-card">
            <span className="eyebrow">SUA CONTRIBUIÇÃO</span>
            <h2>Registrar uma entrega</h2>
            <p>Informe os dados da entrega realizada em um ponto de coleta.</p>
            {user ? (
              <form onSubmit={saveDelivery}>
                <label>Ponto de coleta
                  <select required value={delivery.ponto_id} onChange={e => setDelivery({ ...delivery, ponto_id: e.target.value })}>
                    <option value="">Selecione um ponto</option>
                    {points.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                </label>
                <label>Material
                  <select required value={delivery.material_id} onChange={e => setDelivery({ ...delivery, material_id: e.target.value })}>
                    <option value="">Selecione o material</option>
                    {materials.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                  </select>
                </label>
                <div className="inline-fields">
                  <label>Quantidade
                    <input required type="number" min="0.01" step="0.01" value={delivery.quantidade} onChange={e => setDelivery({ ...delivery, quantidade: e.target.value })} />
                  </label>
                  <label>Unidade
                    <select value={delivery.unidade} onChange={e => setDelivery({ ...delivery, unidade: e.target.value })}>
                      <option>kg</option>
                      <option>unidade</option>
                      <option>litro</option>
                    </select>
                  </label>
                </div>
                <button className="primary">Confirmar entrega</button>
              </form>
            ) : (
              <button className="primary" onClick={() => setTab('login')}>Entre para registrar</button>
            )}
          </section>
        )}

        {tab === 'historico' && (
          <>
            <div className="page-title">
              <span className="eyebrow">SEU CAMINHO SUSTENTÁVEL</span>
              <h1>Meu histórico</h1>
              <p>Acompanhe as entregas registradas na sua conta.</p>
            </div>
            <div className="card table-card">
              {history.length ? (
                history.map(h => (
                  <div className="history-row" key={h.id}>
                    <div className="history-icon"><History /></div>
                    <div>
                      <b>{h.material}</b>
                      <small>{h.ponto} • {new Date(h.data_entrega).toLocaleDateString('pt-BR')}</small>
                    </div>
                    <strong>{h.quantidade} {h.unidade}</strong>
                  </div>
                ))
              ) : (
                <p>Você ainda não possui entregas registradas.</p>
              )}
            </div>
          </>
        )}

        {tab === 'indicadores' && (
          <>
            <div className="page-title">
              <span className="eyebrow">IMPACTO POSITIVO</span>
              <h1>Seus indicadores</h1>
              <p>Resumo baseado nas entregas registradas no sistema.</p>
            </div>
            <div className="stats">
              <div className="card stat">
                <span>Quantidade registrada</span>
                <b>{Number(stats.quantidade || 0).toLocaleString('pt-BR')}*</b>
              </div>
              <div className="card stat">
                <span>Entregas realizadas</span>
                <b>{stats.entregas || 0}</b>
              </div>
            </div>
            <div className="card table-card">
              <h3>Quantidade por material</h3>
              {(stats.materiais || []).map((m: any) => (
                <div className="bar-row" key={m.nome}>
                  <span>{m.nome}</span>
                  <div>
                    <i style={{ width: `${Math.min(100, (Number(m.quantidade) / (Math.max(1, ...(stats.materiais || []).map((x: any) => Number(x.quantidade))))) * 100)}%` }} />
                  </div>
                  <b>{m.quantidade}</b>
                </div>
              ))}
              <small>*A unidade depende daquela informada em cada registro. Os valores não são convertidos automaticamente.</small>
            </div>
          </>
        )}
      </main>

      <footer>
        <div className="brand">
          <div className="brand-icon"><Recycle /></div>
          <div><b>EcoPonto</b><small>INTELIGENTE</small></div>
        </div>
        <span>Conectando pessoas a um futuro mais sustentável.</span>
        <small>Projeto MVP • Sensores IoT previstos para etapa futura</small>
      </footer>
    </div>
  );
}
