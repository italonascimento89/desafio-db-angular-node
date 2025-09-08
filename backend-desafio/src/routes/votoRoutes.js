import express from 'express';
import { VotoRepository } from '../database/repositories/votoRepository.js';
import { UserRepository } from '../database/repositories/userRepository.js';
import { PautaRepository } from '../database/repositories/pautaRepository.js';
import { VotoService } from '../services/votoService.js';
import { VotoController } from '../controllers/votoController.js';

const router = express.Router();

// Injeção de dependências
const votoRepository = new VotoRepository();
const userRepository = new UserRepository();
const pautaRepository = new PautaRepository();
const votoService = new VotoService(votoRepository, userRepository, pautaRepository);
const votoController = new VotoController(votoService);

/**
 * @swagger
 * /v1/votos:
 *   post:
 *     summary: Registrar um voto em uma pauta
 *     tags: [Votos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - id_pauta
 *               - voto
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: "52998224725"
 *               id_pauta:
 *                 type: string
 *                 format: uuid
 *               voto:
 *                 type: string
 *                 enum: [sim, nao]
 *     responses:
 *       201:
 *         description: Voto registrado com sucesso
 *       400:
 *         description: Pauta encerrada ou dados inválidos
 *       404:
 *         description: Usuário ou pauta não encontrados
 *       409:
 *         description: Usuário já votou nessa pauta
 */
router.post('/', votoController.votar);

/**
 * @swagger
 * /v1/votos/resultado/{idPauta}:
 *   get:
 *     summary: Retorna o resultado da votação de uma pauta
 *     tags: [Votos]
 *     parameters:
 *       - in: path
 *         name: idPauta
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da pauta
 *     responses:
 *       200:
 *         description: Resultado da votação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pauta:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 data_inicio:
 *                   type: string
 *                   format: date-time
 *                 data_fim:
 *                   type: string
 *                   format: date-time
 *                 status_sessao:
 *                   type: string
 *                   enum: [aberta, encerrada]
 *                 resultado:
 *                   type: string
 *                   enum: [aprovado, reprovado, parcial]
 *                 porcentagem_sim:
 *                   type: integer
 *                 porcentagem_nao:
 *                   type: integer
 *                 total_sim:
 *                   type: integer
 *                 total_nao:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       404:
 *         description: Pauta não encontrada
 */
router.get('/resultado/:idPauta', votoController.getVotingResult);

export default router;
