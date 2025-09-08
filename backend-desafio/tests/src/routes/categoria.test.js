import request from 'supertest';
import express from 'express';
import { CategoriaController } from '../../../src/controllers/categoriaController.js';

describe('CategoriaController', () => {
  let app;
  let categoriaServiceMock;
  let categoriaController;

  beforeEach(() => {
    categoriaServiceMock = {
      criarCategoria: jest.fn(),
      listarCategorias: jest.fn(),
    };

    categoriaController = new CategoriaController(categoriaServiceMock);

    app = express();
    app.use(express.json());
    app.post('/v1/categorias', categoriaController.criarCategoria);
    app.get('/v1/categorias', categoriaController.listarCategorias);

    jest.spyOn(console, 'error').mockImplementation(() => {}); // Silencia logs de erro
  });

  describe('POST /v1/categorias', () => {
    it('deve criar categoria com sucesso', async () => {
      const categoriaMock = { id: '1', nome: 'Administrativo' };
      categoriaServiceMock.criarCategoria.mockResolvedValue(categoriaMock);

      const res = await request(app).post('/v1/categorias').send({ nome: 'Administrativo' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(categoriaMock);
    });

    it('deve retornar 409 se categoria já existe', async () => {
      categoriaServiceMock.criarCategoria.mockRejectedValue(new Error('CATEGORY_EXISTS'));

      const res = await request(app).post('/v1/categorias').send({ nome: 'Administrativo' });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'Categoria já cadastrada' });
    });

    it('deve retornar 500 para erros desconhecidos', async () => {
      categoriaServiceMock.criarCategoria.mockRejectedValue(new Error('Erro desconhecido'));

      const res = await request(app).post('/v1/categorias').send({ nome: 'Administrativo' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Erro ao criar categoria' });
    });
  });

  describe('GET /v1/categorias', () => {
    it('deve listar categorias com sucesso', async () => {
      const categoriasMock = [
        { id: '1', nome: 'Administrativo' },
        { id: '2', nome: 'Financeiro' },
      ];
      categoriaServiceMock.listarCategorias.mockResolvedValue(categoriasMock);

      const res = await request(app).get('/v1/categorias');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(categoriasMock);
    });

    it('deve retornar 500 para erro desconhecido', async () => {
      categoriaServiceMock.listarCategorias.mockRejectedValue(new Error('Erro desconhecido'));

      const res = await request(app).get('/v1/categorias');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Erro ao listar categorias' });
    });
  });
});
