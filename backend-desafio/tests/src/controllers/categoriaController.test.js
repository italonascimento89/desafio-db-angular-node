import { CategoriaController } from '../../../src/controllers/categoriaController.js';

describe('CategoriaController', () => {
  let categoriaServiceMock;
  let categoriaController;
  let req;
  let res;

  beforeEach(() => {
    // Mock do service
    categoriaServiceMock = {
      criarCategoria: jest.fn(),
      listarCategorias: jest.fn(),
    };

    categoriaController = new CategoriaController(categoriaServiceMock);

    // Mock do request e response
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('criarCategoria', () => {
    it('deve criar uma categoria com sucesso', async () => {
      const categoriaMock = { id: 'uuid-categoria', nome: 'Financeiro' };
      req.body = { nome: 'Financeiro' };
      categoriaServiceMock.criarCategoria.mockResolvedValue(categoriaMock);

      await categoriaController.criarCategoria(req, res);

      expect(categoriaServiceMock.criarCategoria).toHaveBeenCalledWith('Financeiro');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(categoriaMock);
    });

    it('deve retornar 409 se a categoria já existe', async () => {
      req.body = { nome: 'Financeiro' };
      categoriaServiceMock.criarCategoria.mockRejectedValue(new Error('CATEGORY_EXISTS'));

      await categoriaController.criarCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria já cadastrada' });
    });

    it('deve retornar 500 em caso de erro inesperado', async () => {
      req.body = { nome: 'Financeiro' };
      categoriaServiceMock.criarCategoria.mockRejectedValue(new Error('Erro desconhecido'));

      await categoriaController.criarCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar categoria' });
    });
  });

  describe('listarCategorias', () => {
    it('deve listar categorias com sucesso', async () => {
      const categoriasMock = [
        { id: 'uuid1', nome: 'Financeiro' },
        { id: 'uuid2', nome: 'Operacional' },
      ];
      categoriaServiceMock.listarCategorias.mockResolvedValue(categoriasMock);

      await categoriaController.listarCategorias(req, res);

      expect(categoriaServiceMock.listarCategorias).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(categoriasMock);
    });

    it('deve retornar 500 em caso de erro na listagem', async () => {
      categoriaServiceMock.listarCategorias.mockRejectedValue(new Error('Erro desconhecido'));

      await categoriaController.listarCategorias(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao listar categorias' });
    });
  });
});
