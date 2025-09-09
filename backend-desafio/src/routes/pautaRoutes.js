import express from 'express';
import { PautaRepository } from '../database/repositories/pautaRepository.js';
import { PautaService } from '../services/pautaService.js';
import { PautaController } from '../controllers/pautaController.js';
import { UserService } from '../services/userService.js';
import { UserRepository } from '../database/repositories/userRepository.js';

const router = express.Router();

// Injeção de dependências
const userRepository = new UserRepository();
const pautaRepository = new PautaRepository();
const pautaService = new PautaService(pautaRepository);
const userService = new UserService(userRepository);
const pautaController = new PautaController(pautaService, userService);

/**
 * @swagger
 * components:
 *   schemas:
 *     Pauta:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nome:
 *           type: string
 *         descricao:
 *           type: string
 *         tempo_aberta:
 *           type: integer
 *           description: tempo em minutos
 */

/**
 * @swagger
 * /v1/pautas:
 *   post:
 *     summary: Cria uma nova pauta
 *     tags: [Pautas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - id_admin
 *             properties:
 *               categoria:
 *                 type: string
 *                 example: "Administrativo"
 *               nome:
 *                 type: string
 *                 example: "Pauta 1"
 *               descricao:
 *                 type: string
 *                 example: "Descrição da pauta"
 *               tempo_aberta:
 *                 type: integer
 *                 example: 1
 *               id_admin:
 *                 type: string
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *     responses:
 *       201:
 *         description: Pauta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pauta'
 */
router.post('/', pautaController.createPauta);

/**
 * @swagger
 * /v1/pautas:
 *   get:
 *     summary: Lista todas as pautas com paginação
 *     tags: [Pautas]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Governança
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Status da Pauta (aberta, encerrada)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página da paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista paginada de pautas
 */
router.get('/', pautaController.listPautas);

/**
 * @swagger
 * /v1/pautas/{id}:
 *   get:
 *     summary: Busca uma pauta pelo ID
 *     tags: [Pautas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da pauta
 *     responses:
 *       200:
 *         description: Detalhes da pauta
 *       404:
 *         description: Pauta não encontrada
 */
router.get('/:id', pautaController.getPautaById);

export default router;
