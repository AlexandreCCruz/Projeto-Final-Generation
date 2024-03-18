const knex = require('../conexao');

/**
 * @swagger
 * /postagem:
 *   post:
 *     summary: Cria uma nova postagem
 *     tags: [Postagem]
 *     description: Cria uma nova postagem.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - texto
 *               - usuario_id
 *               - tema_id
 *             properties:
 *               titulo:
 *                 type: string
 *               texto:
 *                 type: string
 *               usuario_id:
 *                 type: integer
 *               tema_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Postagem criada com sucesso
 *       404:
 *         description: Erro na criação da postagem
 */

const criarPostagem = async (req, res) => {
    const { titulo, texto, usuario_id, tema_id } = req.body;

    if (!titulo || titulo.length < 5) {
        return res.status(400).json('O título é obrigatório e deve ter no mínimo 5 caracteres.');
    }

    if (!texto || texto.length < 10) {
        return res.status(400).json('O texto é obrigatório e deve ter no mínimo 10 caracteres.');
    }

    try {
        const novaPostagem = await knex('postagem').insert({
            titulo,
            texto,
            usuario_id,
            tema_id,

        }).returning("*");

        const usuario = await knex('usuarios').where('id', usuario_id).select('nome').first();
        const tema = await knex('tema').where('id', tema_id).select('descricao').first();

        const retorno = {
            id: novaPostagem[0].id,
            titulo: novaPostagem[0].titulo,
            texto: novaPostagem[0].texto,
            data: novaPostagem[0].data,
            usuario_nome: usuario.nome,
            tema_descricao: tema.descricao
        };

        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /postagem:
 *   get:
 *     summary: Lista todas as postagens
 *     tags: [Postagem]
 *     description: Retorna uma lista com todas as postagens.
 *     properties:
 *         tipo:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID da postagem
 *               titulo:
 *                 type: string
 *                 description: Título da postagem
 *               conteudo:
 *                 type: string
 *                 description: Conteúdo da postagem
 *               dataCriacao:
 *                 type: string
 *                 format: date-time
 *                 description: Data de criação da postagem
 *     responses:
 *       200:
 *         description: Lista de postagens
 *       404:
 *         description: Nenhuma postagem encontrada
 */

const listarPostagens = async (req, res) => {
    try {
        const postagens = await knex('postagem').select('*');

        return res.status(200).json(postagens);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /postagem/{id}:
 *   get:
 *     summary: Lista uma postagem por ID
 *     tags: [Postagem]
 *     description: Retorna a postagem do ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id da postagem consultada.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Postagem encontrada
 *       404:
 *         description: Postagem não encontrada
 */

const listarPostagemPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const postagem = await knex('postagem').where({ id }).first();

        if (!postagem) {
            return res.status(400).json('Postagem não encontrada.');
        }

        return res.status(200).json(postagem);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /postagem/{id}:
 *   put:
 *     summary: Atualiza uma postagem existente
 *     tags: [Postagem]
 *     description: Atualiza as informações da postagem do ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id da postagem que será atualizada.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               texto:
 *                 type: string
 *               usuario_id:
 *                 type: integer
 *               tema_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Postagem atualizada com sucesso
 *       404:
 *         description: Erro na atualização da postagem
 */

const atualizarPostagem = async (req, res) => {
    const { id } = req.params;
    const { titulo, texto, usuario_id, tema_id } = req.body;

    try {
        const postagemExistente = await knex('postagem').where({ id }).first();

        if (!postagemExistente) {
            return res.status(400).json('Postagem não encontrada.');
        }

        const postagemAtualizada = await knex('postagem')
            .where({ id })
            .update({
                titulo,
                texto,
                usuario_id,
                tema_id
            })
            .returning("*");

        const usuario = await knex('usuarios').where('id', usuario_id).select('nome').first();
        const tema = await knex('tema').where('id', tema_id).select('descricao').first();

        const retorno = {
            id: postagemAtualizada[0].id,
            titulo: postagemAtualizada[0].titulo,
            texto: postagemAtualizada[0].texto,
            data: postagemAtualizada[0].data,
            usuario_nome: usuario.nome,
            tema_descricao: tema.descricao
        };

        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /postagem/{id}:
 *   delete:
 *     summary: Exclui uma postagem
 *     tags: [Postagem]
 *     description: Exclui a postagem do ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id da postagem que será excluída.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Postagem excluída com sucesso
 *       404:
 *         description: Postagem não encontrada
 */

const excluirPostagem = async (req, res) => {
    const { id } = req.params;

    try {
        const postagemExistente = await knex('postagem').where({ id }).first();

        if (!postagemExistente) {
            return res.status(400).json('Postagem não encontrada.');
        }

        await knex('postagem').where({ id }).del();

        return res.status(200).json('Postagem excluida com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    criarPostagem,
    listarPostagens,
    listarPostagemPorId,
    atualizarPostagem,
    excluirPostagem
};
