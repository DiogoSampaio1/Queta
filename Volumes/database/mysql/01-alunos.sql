SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS Alunos
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE Alunos;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Avaliacoes;
DROP TABLE IF EXISTS Matriculas;
DROP TABLE IF EXISTS TurmaDisciplinas;
DROP TABLE IF EXISTS Disciplinas;
DROP TABLE IF EXISTS Alunos;
DROP TABLE IF EXISTS Turmas;
DROP TABLE IF EXISTS Cursos;

SET FOREIGN_KEY_CHECKS = 1;


-- =============================================
-- TABELA: Cursos
-- =============================================

CREATE TABLE Cursos (
    curso_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nome VARCHAR(120) NOT NULL,
    descricao VARCHAR(500),
    duracao_anos TINYINT UNSIGNED NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_curso_duracao
        CHECK (duracao_anos BETWEEN 1 AND 8)

) ENGINE=InnoDB;


-- =============================================
-- TABELA: Turmas
-- =============================================

CREATE TABLE Turmas (
    turma_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    curso_id INT UNSIGNED NULL,
    codigo VARCHAR(20) NOT NULL,
    ano_letivo VARCHAR(9) NOT NULL,
    limite_alunos SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_turma_ano
        UNIQUE (codigo, ano_letivo),

    CONSTRAINT chk_turma_ano
        CHECK (
            ano_letivo REGEXP '^[0-9]{4}/[0-9]{4}$'
        ),

    CONSTRAINT chk_turma_limite
        CHECK (limite_alunos BETWEEN 1 AND 100),

    CONSTRAINT fk_turma_curso
        FOREIGN KEY (curso_id) REFERENCES Cursos(curso_id)
        ON UPDATE CASCADE ON DELETE RESTRICT

) ENGINE=InnoDB;

CREATE INDEX idx_turmas_curso ON Turmas(curso_id);


-- =============================================
-- TABELA: Alunos
-- =============================================

CREATE TABLE Alunos (
    aluno_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    turma_id INT UNSIGNED NULL,
    numero_aluno VARCHAR(20) NOT NULL UNIQUE,
    nome_proprio VARCHAR(80) NOT NULL,
    apelido VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(254) UNIQUE,
    telefone VARCHAR(25),
    morada VARCHAR(255),
    codigo_postal VARCHAR(12),
    localidade VARCHAR(100),
    passphrase VARCHAR(255) NOT NULL,
    role ENUM('admin', 'professor', 'aluno') DEFAULT 'aluno',

    estado ENUM('Ativo', 'Inativo', 'Transferido', 'Concluido')
        NOT NULL DEFAULT 'Ativo',

    observacoes VARCHAR(500),

    CONSTRAINT chk_aluno_nascimento
        CHECK (data_nascimento >= '1900-01-01'),

    CONSTRAINT fk_aluno_turma
        FOREIGN KEY (turma_id) REFERENCES Turmas(turma_id)
        ON UPDATE CASCADE ON DELETE RESTRICT

) ENGINE=InnoDB;

CREATE INDEX idx_alunos_nome ON Alunos(apelido, nome_proprio);
CREATE INDEX idx_alunos_estado ON Alunos(estado);


-- =============================================
-- TABELA: Disciplinas
-- =============================================

CREATE TABLE Disciplinas (
    disciplina_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    curso_id INT UNSIGNED NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    ano_curricular TINYINT UNSIGNED NOT NULL,
    horas_anuais SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    obrigatoria BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_disciplina_curso_codigo
        UNIQUE (curso_id, codigo),

    CONSTRAINT uq_disciplina_curso_nome
        UNIQUE (curso_id, nome),

    CONSTRAINT chk_disciplina_ano
        CHECK (ano_curricular BETWEEN 1 AND 8),

    CONSTRAINT fk_disciplina_curso
        FOREIGN KEY (curso_id) REFERENCES Cursos(curso_id)
        ON UPDATE CASCADE ON DELETE CASCADE

) ENGINE=InnoDB;

CREATE INDEX idx_disciplinas_curso ON Disciplinas(curso_id);


-- =============================================
-- TABELA: Avaliacoes
-- =============================================

CREATE TABLE Avaliacoes (
    avaliacao_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT UNSIGNED NOT NULL,
    disciplina_id INT UNSIGNED NOT NULL,
    designacao VARCHAR(120) NOT NULL,
    data_avaliacao DATE NOT NULL,
    nota DECIMAL(4,2),
    nota_maxima DECIMAL(4,2) NOT NULL DEFAULT 20.00,
    peso DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    observacoes VARCHAR(500),

    CONSTRAINT chk_avaliacao_nota
        CHECK (
            nota IS NULL OR (nota >= 0 AND nota <= nota_maxima)
        ),

    CONSTRAINT chk_avaliacao_nota_max
        CHECK (nota_maxima > 0),

    CONSTRAINT chk_avaliacao_peso
        CHECK (peso > 0),

    CONSTRAINT fk_avaliacao_aluno
        FOREIGN KEY (aluno_id) REFERENCES Alunos(aluno_id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT fk_avaliacao_disciplina
        FOREIGN KEY (disciplina_id) REFERENCES Disciplinas(disciplina_id)
        ON UPDATE CASCADE ON DELETE RESTRICT

) ENGINE=InnoDB;

CREATE INDEX idx_avaliacoes_aluno ON Avaliacoes(aluno_id);
CREATE INDEX idx_avaliacoes_disciplina ON Avaliacoes(disciplina_id);


-- =============================================
-- DADOS INICIAIS: Cursos
-- =============================================

INSERT INTO Cursos (codigo, nome, descricao, duracao_anos) VALUES
('TSRSI', 'Redes e Sistemas Informáticos',
 'Configuração, administração e manutenção de redes e sistemas.', 2),

('TGPSI', 'Gestão e Programação de Sistemas Informáticos',
 'Desenvolvimento de aplicações e administração de sistemas.', 3),

('TSM', 'Sistemas de Informação Marítimos e Portuários',
 'Sistemas de informação aplicados ao contexto marítimo e portuário.', 2);


-- =============================================
-- DADOS INICIAIS: Turmas
-- =============================================

INSERT INTO Turmas (curso_id, codigo, ano_letivo, limite_alunos) VALUES
(1, 'RSI1A', '2026/2027', 25),
(1, 'RSI2A', '2026/2027', 25),
(2, 'GPSI1A', '2026/2027', 28),
(3, 'SIM1A', '2026/2027', 24);


-- =============================================
-- DADOS INICIAIS: Alunos
-- =============================================

INSERT INTO Alunos
(turma_id, numero_aluno, nome_proprio, apelido, data_nascimento,
 email, telefone, morada, codigo_postal, localidade, passphrase, role, estado)
VALUES

(1, 'A2026001', 'João', 'Silva', '2007-03-14',
 'joao.silva@example.com', '910000001',
 'Rua das Flores, 10', '2735-100', 'Cacém', 'passteste1', 'aluno', 'Ativo'),

(1, 'A2026002', 'Maria', 'Santos', '2006-11-02',
 'maria.santos@example.com', '910000002',
 'Rua Central, 25', '2745-200', 'Queluz', 'passteste1', 'aluno', 'Ativo'),

(1, 'A2026003', 'Pedro', 'Costa', '2007-07-21',
 'pedro.costa@example.com', '910000003',
 'Avenida Nova, 8', '2725-300', 'Mem Martins', 'passteste1', 'aluno', 'Ativo'),

(2, 'A2026004', 'Inês', 'Ferreira', '2006-01-30',
 'ines.ferreira@example.com', '910000004',
 'Rua do Sol, 4', '2730-400', 'Barcarena', 'passteste1', 'aluno', 'Ativo'),

(3, 'A2026005', 'Tiago', 'Oliveira', '2005-09-12',
 'tiago.oliveira@example.com', '910000005',
 'Rua Verde, 17', '2740-500', 'Porto Salvo', 'passteste1', 'aluno', 'Ativo'),

(3, 'A2026006', 'Beatriz', 'Martins', '2007-05-06',
 'beatriz.martins@example.com', '910000006',
 'Rua do Parque, 6', '2735-600', 'Agualva', 'passteste1', 'aluno', 'Ativo'),

(4, 'A2026007', 'Diogo', 'Pereira', '2006-12-18',
 'diogo.pereira@example.com', '910000007',
 'Avenida do Mar, 12', '2780-700', 'Oeiras', 'passteste1', 'aluno', 'Ativo'),

(4, 'A2026008', 'Leonor', 'Rodrigues', '2005-04-25',
 'leonor.rodrigues@example.com', '910000008',
 'Rua da Escola, 3', '2710-800', 'Sintra', 'passteste1', 'aluno', 'Ativo'),

(NULL, '123', 'Diogo', 'DEV', '2007-06-21',
 'DiogoDEV@gmail.com', '91111119',
 '.', '.', '.', '$2a$12$nspwSGVpMZG4JN5HCjKO6.p4U7LZNGZrWz9TYoCsJw1TSJopfgswS',
 'admin', 'Ativo');


-- =============================================
-- DADOS INICIAIS: Disciplinas
-- =============================================

INSERT INTO Disciplinas
(curso_id, codigo, nome, ano_curricular, horas_anuais, obrigatoria)
VALUES

(1, 'RSI101', 'Fundamentos de Redes', 1, 120, TRUE),
(1, 'RSI102', 'Sistemas Operativos', 1, 100, TRUE),
(1, 'RSI201', 'Administração de Redes', 2, 120, TRUE),

(2, 'GPSI101', 'Programação', 1, 140, TRUE),
(2, 'GPSI102', 'Bases de Dados', 1, 120, TRUE),

(3, 'SIM101', 'Sistemas de Informação', 1, 120, TRUE),
(3, 'SIM102', 'Tecnologias de Identificação e Tracking', 1, 100, TRUE);


-- =============================================
-- DADOS INICIAIS: Avaliações
-- =============================================

INSERT INTO Avaliacoes
(aluno_id, disciplina_id, designacao, data_avaliacao, nota, nota_maxima, peso)
VALUES

(1, 1, 'Teste 1', '2026-10-02', 15.50, 20.00, 1.00),
(1, 2, 'Trabalho prático', '2026-10-07', 17.00, 20.00, 1.50),
(2, 1, 'Teste 1', '2026-10-02', 13.00, 20.00, 1.00),
(3, 1, 'Teste 1', '2026-10-02', 11.50, 20.00, 1.00),
(5, 4, 'Exercício de programação', '2026-10-05', 16.00, 20.00, 1.00),
(7, 6, 'Trabalho de tracking', '2026-10-06', 18.00, 20.00, 1.50);


-- =============================================
-- CRIAR UTILIZADOR (OPCIONAL)
-- =============================================

-- CREATE USER 'Diogo'@'localhost'
-- IDENTIFIED BY 'teste';

-- GRANT SELECT, INSERT, UPDATE, DELETE
-- ON Alunos.*
-- TO 'Diogo'@'localhost';


