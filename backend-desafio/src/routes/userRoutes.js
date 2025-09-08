import express from 'express';
import { UserRepository } from '../database/repositories/userRepository.js';
import { UserService } from '../services/userService.js';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

// Injeção de dependências
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         cpf:
 *           type: string
 *           example: "52998224725"
 *         tipo:
 *           type: string
 *           enum: [admin, voters]
 */

/**
 * @swagger
 * /v1/users/admin:
 *   post:
 *     summary: Cria um usuário adiministrador
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: "055.273.390-37"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: CPF ou Tipo inválido
 *       409:
 *         description: CPF já cadastrado
 */
router.post('/admin', userController.createUserAdmin);

/**
 * @swagger
 * /v1/users/voters:
 *   post:
 *     summary: Cria um usuário votante
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - id_admin
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: "055.273.390-37"
 *               id_admin:
 *                 type: string
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: CPF ou Tipo inválido
 *       409:
 *         description: CPF já cadastrado
 */
router.post('/voters', userController.createUserVoters);

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', userController.listUsers);

/**
 * @swagger
 * /v1/users/{cpf}:
 *   get:
 *     summary: Buscar usuário por CPF
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *           example: "52998224725"
 *         description: CPF do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: CPF inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:cpf', userController.buscarPorCpf);

export default router;
