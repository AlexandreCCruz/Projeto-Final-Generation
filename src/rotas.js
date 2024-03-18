const express = require("express");
const rotas = express();

const {
    listarUsuarios,
    listarUsuarioPorID,
    cadastrarUsuario,
    atualizarUsuario,
    excluirUsuario
} = require('./controladores/usuarios');

const {
    listarTemas,
    listarTemaPorId,
    criarTemas,
    atualizarTema,
    excluirTema
} = require('./controladores/temas');

const {
    listarPostagens,
    listarPostagemPorId,
    criarPostagem,
    atualizarPostagem,
    excluirPostagem
} = require('./controladores/postagem');

rotas.get('/usuarios', listarUsuarios);
rotas.get('/usuarios/:id', listarUsuarioPorID);
rotas.post('/usuarios', cadastrarUsuario);
rotas.put('/usuarios/:id', atualizarUsuario);
rotas.delete('/usuarios/:id', excluirUsuario);

rotas.get('/temas', listarTemas);
rotas.get('/temas/:id', listarTemaPorId);
rotas.post('/temas', criarTemas);
rotas.put('/temas/:id', atualizarTema);
rotas.delete('/temas/:id', excluirTema);

rotas.get('/postagem', listarPostagens);
rotas.get('/postagem/:id', listarPostagemPorId);
rotas.post('/postagem', criarPostagem);
rotas.put('/postagem/:id', atualizarPostagem);
rotas.delete('/postagem/:id', excluirPostagem);

module.exports = rotas;