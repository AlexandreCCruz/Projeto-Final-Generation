const knex = require('../conexao');

/**
 * @swagger
 * /temas:
 *   post:
 *     summary: Cria um novo tema
 *     tags: [Tema]
 *     description: Cria um novo tema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:               
 *               descricao
 *             properties:
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tema criado com sucesso
 *       404:
 *         description: Erro na criação do tema
 */

const criarTemas = async (req, res) => {
    const { descricao } = req.body;

    if (!descricao || descricao.length < 3) {
        return res.status(400).json('A descrição é obrigatório e deve ter no mínimo 3 caracteres.');
    }

    try {
        const novoTema = await knex('tema').insert({
            descricao
        }).returning('*');

        return res.status(200).json(novoTema[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /temas:
 *   get:
 *     summary: Lista todos os temas
 *     tags: [Tema]
 *     description: Retorna uma lista com todos os temas disponíveis.
 *     properties:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do tema
 *                   descricao:
 *                     type: string
 *                     description: Descrição do tema
 *     responses:
 *       200:
 *         description: Lista de temas
 *       404:
 *         description: Nenhum tema encontrado
 */

const listarTemas = async (req, res) => {
    try {
        const temas = await knex('tema').select('*');

        return res.status(200).json(temas);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /temas/{id}:
 *   get:
 *     summary: Lista um tema por ID.
 *     tags: [Tema]
 *     description: Retorna o tema do ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id do tema consultado.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tema encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do tema
 *                 nome:
 *                   type: string
 *                   description: Nome do tema
 *                 descricao:
 *                   type: string
 *                   description: Descrição do tema
 *       404:
 *         description: Tema não encontrado
 */

const listarTemaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const tema = await knex('tema').where({ id }).first();

        if (!tema) {
            return res.status(404).json('Tema não encontrado.');
        }

        return res.status(200).json(tema);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /temas/{id}:
 *   put:
 *     summary: Atualiza um tema específico
 *     tags: [Tema]
 *     description: Atualiza o tema por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id do tema que será atualizado.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Descrição atualizada do tema
 *     responses:
 *       200:
 *         description: Tema atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do tema
 *                 descricao:
 *                   type: string
 *                   description: Descrição atualizada do tema
 *       400:
 *         description: Erro na requisição
 *       404:
 *         description: Tema não encontrado
 */

const atualizarTema = async (req, res) => {
    const { id } = req.params;
    const { descricao } = req.body;

    try {
        const temaExistente = await knex('tema').where({ id }).first();

        if (!temaExistente) {
            return res.status(404).json('Tema não encontrado.');
        }

        const temaAtualizado = await knex('tema')
            .where({ id })
            .update({
                descricao
            })
            .returning("*");

        return res.status(200).json(temaAtualizado[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /temas/{id}:
 *   delete:
 *     summary: Exclui um tema específico
 *     tags: [Tema]
 *     description: Exclui o tema do ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id do tema que será excluído.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tema excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *       404:
 *         description: Tema não encontrado
 */

const excluirTema = async (req, res) => {
    const { id } = req.params;

    try {
        const temaExistente = await knex('tema').where({ id }).first();

        if (!temaExistente) {
            return res.status(404).json('Tema não encontrado.');
        }

        await knex('tema').where({ id }).del();

        return res.status(200).json('Tema excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    criarTemas,
    listarTemas,
    listarTemaPorId,
    atualizarTema,
    excluirTema
};
