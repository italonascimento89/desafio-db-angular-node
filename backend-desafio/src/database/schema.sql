-- Habilitar extensão para gerar UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    tipo VARCHAR(10) NOT NULL
);

-- Criar tabela pautas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS pautas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) UNIQUE NOT NULL,
    descricao TEXT,
    categoria TEXT NOT NULL,
    tempo_aberta INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para atualizar updated_at automaticamenteNOT NUL
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pautas_updated_at
BEFORE UPDATE ON pautas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela votos
CREATE TABLE IF NOT EXISTS votos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cpf VARCHAR(11) NOT NULL,
    pauta_id UUID NOT NULL REFERENCES pautas(id) ON DELETE CASCADE,
    voto VARCHAR(3) NOT NULL CHECK (voto IN ('sim', 'nao')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (cpf, pauta_id)
);

-- Tabela categorias
CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL UNIQUE
);

INSERT INTO categorias (id, nome) VALUES
('7907da08-55bc-43e0-b993-b6286a5491b5'::uuid, 'Administrativo'),
('2d2397f0-b607-4222-8708-8550b97a4f5c'::uuid, 'Financeiro'),
('f972977f-46fb-46de-8706-7b33c71dd063'::uuid, 'Governança'),
('a2b9e174-8312-4516-a486-7e46d0cf4e89'::uuid, 'Operacional'),
('0cf9f96e-a8c0-4eef-90c3-7e7f04a5b84a'::uuid, 'Estratégico'),
('68c40156-d5bb-4b9e-9cbc-2f8357068ade'::uuid, 'Recursos Humanos'),
('6b5a9a29-1de4-4644-9b8b-97a866b25e84'::uuid, 'Projetos & Inovação');

INSERT INTO users (id, cpf, tipo) VALUES
('e78b2890-4c70-4621-919b-606481ba91df'::uuid, '53683399090', 'votante'),
('7bec9c69-ce0a-405e-a02f-8947acffbd37'::uuid, '65965235003', 'admin');