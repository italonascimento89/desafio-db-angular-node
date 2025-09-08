import express from 'express';
import { CategoriaController } from '../controllers/categoriaController.js';
import { CategoriaService } from '../services/categoriaService.js';
import { CategoriaRepository } from '../database/repositories/categoriaRepository.js';

const router = express.Router();

// Injeção de dependências
const categoriaRepository = new CategoriaRepository();
const categoriaService = new CategoriaService(categoriaRepository);
const categoriaController = new CategoriaController(categoriaService);

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nome:
 *           type: string
 *           example: "Administrativo"
 */

/**
 * @swagger
 * /v1/categorias:
 *   post:
 *     summary: Cria Categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Administrativo"
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Categoria inválida
 *       409:
 *         description: Categoria já cadastrada
 */
router.post('/', categoriaController.criarCategoria);

/**
 * @swagger
 * /v1/categorias:
 *   get:
 *     summary: Lista todas as Categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de Categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
router.get('/', categoriaController.listarCategorias);

export default router;
