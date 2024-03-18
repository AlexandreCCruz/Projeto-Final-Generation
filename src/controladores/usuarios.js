const knex = require('../conexao');

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     description: Cria um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               foto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro na criação do usuário
 */

const cadastrarUsuario = async (req, res) => {
    const { nome, email, foto } = req.body;

    if (!nome || nome.length < 3) {
        return res.status(400).json('O nome é obrigatório e deve ter no mínimo 3 caracteres.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json('O e-mail é obrigatório e deve ter um formato válido.');
    }

    try {
        const emailEncontrado = await knex('usuarios').where({ email }).first();

        if (emailEncontrado) {
            return res.status(400).json('O email já existe');
        } else {
            usuario = await knex('usuarios')
                .insert({
                    nome,
                    email,
                    foto
                })
                .returning(['nome', 'email', 'foto']);
        }

        if (!usuario) {
            return res.status(400).json('O usuário não foi cadastrado.');
        }

        return res.status(200).json(usuario[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     description: Retorna uma lista com todos os usuários.
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

const listarUsuarios = async (req, res) => {
    const usuarios = await knex('usuarios')
    return res.status(200).json(usuarios);
}

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Lista um usuário por ID
 *     tags: [Usuários]
 *     description: Retorna o usuário do id.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id do usuario consultado.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */

const listarUsuarioPorID = async (req, res) => {
    const { id } = req.params;

    try {
        const usuarioEncontrado = await knex('usuarios')
            .where({ id })
            .first();

        if (!usuarioEncontrado) {
            return res.status(400).json('Usuario não encontrado');
        }

        return res.status(200).json(usuarioEncontrado);
    } catch (error) {
        return res.status(404).json(error.message);
    }
}

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     description: atualiza o usuário do ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id do usuario que será atualizado.
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
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               foto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Erro na atualização do usuário
 */

const atualizarUsuario = async (req, res) => {
    const { nome, email, foto } = req.body;

    if (!nome || nome.length < 3) {
        return res.status(400).json('O nome é obrigatório e deve ter no mínimo 3 caracteres.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json('O e-mail é obrigatório e deve ter um formato válido.');
    }

    try {
        const { id } = req.params;

        const usuarioEncontrado = await knex('usuarios').where({ id }).first();

        if (!usuarioEncontrado) {
            return res.status(404).json('Usuário não encontrado.');
        }

        const usuarioAtualizado = await knex('usuarios')
            .where({ id })
            .update({
                nome,
                email,
                foto
            })
            .returning(['nome', 'email', 'foto']);

        if (!usuarioAtualizado) {
            return res.status(400).json('Falha ao atualizar as informações do usuário.');
        }

        return res.status(200).json(usuarioAtualizado[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     tags: [Usuários]
 *     description: Exclui o usuário do ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id do usuario que será excluído.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

const excluirUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuarioEncontrado = await knex('usuarios')
            .where({ id })
            .first();

        if (!usuarioEncontrado) {
            return res.status(404).json('Usuario não encontrado');
        }

        const excluirUsuario = await knex('usuarios')
            .where({ id })
            .del()

        if (!excluirUsuario) {
            return res.status(400).json('Usuario não foi excluído');
        }

        return res.status(200).json('Usuario excluído com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    listarUsuarios,
    listarUsuarioPorID,
    atualizarUsuario,
    excluirUsuario
}