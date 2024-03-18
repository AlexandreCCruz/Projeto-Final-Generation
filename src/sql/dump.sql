CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    foto VARCHAR(255)
);

CREATE TABLE Tema (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE Postagem (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER,
    tema_id INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    FOREIGN KEY (tema_id) REFERENCES Tema(id)
);

