CREATE TABLE IF NOT EXISTS usuarios (
 id SERIAL PRIMARY KEY, nome VARCHAR(120) NOT NULL, email VARCHAR(160) UNIQUE NOT NULL,
 senha_hash TEXT NOT NULL, tipo VARCHAR(20) NOT NULL DEFAULT 'usuario',
 data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(), ativo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS materiais (
 id SERIAL PRIMARY KEY, nome VARCHAR(80) NOT NULL, descricao TEXT,
 orientacao_descarte TEXT NOT NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS pontos_coleta (
 id SERIAL PRIMARY KEY, nome VARCHAR(120) NOT NULL, descricao TEXT, endereco TEXT NOT NULL,
 latitude NUMERIC(10,7), longitude NUMERIC(10,7), capacidade VARCHAR(80),
 status VARCHAR(20) NOT NULL DEFAULT 'ativo', data_cadastro TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS ponto_materiais (
 ponto_id INTEGER REFERENCES pontos_coleta(id) ON DELETE CASCADE,
 material_id INTEGER REFERENCES materiais(id) ON DELETE CASCADE,
 PRIMARY KEY (ponto_id, material_id)
);
CREATE TABLE IF NOT EXISTS entregas (
 id SERIAL PRIMARY KEY, usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
 ponto_id INTEGER NOT NULL REFERENCES pontos_coleta(id), material_id INTEGER NOT NULL REFERENCES materiais(id),
 quantidade NUMERIC(10,2) NOT NULL CHECK (quantidade > 0), unidade VARCHAR(12) NOT NULL DEFAULT 'kg',
 data_entrega TIMESTAMP NOT NULL DEFAULT NOW()
);
INSERT INTO materiais (nome, descricao, orientacao_descarte) VALUES
('Papel','Folhas, jornais e caixas de papelão limpos.','Mantenha seco, retire restos de alimentos e dobre as caixas.'),
('Plástico','Garrafas PET, embalagens e frascos.','Esvazie as embalagens e, se possível, enxágue e amasse.'),
('Metal','Latas de alumínio e aço.','Esvazie e limpe as latas. Tenha cuidado com bordas cortantes.'),
('Vidro','Garrafas e potes de vidro.','Encaminhe limpo e protegido; embale separadamente se estiver quebrado.'),
('Eletrônicos','Cabos, celulares e pequenos equipamentos sem uso.','Não descarte no lixo comum. Procure ponto que receba resíduos eletrônicos.')
ON CONFLICT DO NOTHING;
