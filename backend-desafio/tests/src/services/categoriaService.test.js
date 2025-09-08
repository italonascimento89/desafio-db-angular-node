import { CategoriaService } from '../../../src/services/categoriaService.js';

describe('CategoriaService', () => {
  let categoriaRepositoryMock;
  let categoriaService;

  beforeEach(() => {
    categoriaRepositoryMock = {
      buscarPorNome: jest.fn(),
      criar: jest.fn(),
      listar: jest.fn(),
    };

    categoriaService = new CategoriaService(categoriaRepositoryMock);
  });

  describe('criarCategoria', () => {
    it('deve criar uma nova categoria com sucesso', async () => {
      categoriaRepositoryMock.buscarPorNome.mockResolvedValue(null);
      categoriaRepositoryMock.criar.mockResolvedValue({ id: 'uuid', nome: 'Eletrônicos' });

      const result = await categoriaService.criarCategoria('Eletrônicos');

      expect(result).toEqual({ id: 'uuid', nome: 'Eletrônicos' });
      expect(categoriaRepositoryMock.criar).toHaveBeenCalledWith('Eletrônicos');
    });

    it('deve lançar CATEGORY_EXISTS se categoria já existir', async () => {
      categoriaRepositoryMock.buscarPorNome.mockResolvedValue({ id: 'uuid', nome: 'Eletrônicos' });

      await expect(categoriaService.criarCategoria('Eletrônicos')).rejects.toThrow('CATEGORY_EXISTS');
    });
  });

  describe('listarCategorias', () => {
    it('deve retornar lista de categorias', async () => {
      const categoriasMock = [
        { id: '1', nome: 'Eletrônicos' },
        { id: '2', nome: 'Móveis' },
      ];
      categoriaRepositoryMock.listar.mockResolvedValue(categoriasMock);

      const result = await categoriaService.listarCategorias();

      expect(result).toEqual(categoriasMock);
      expect(categoriaRepositoryMock.listar).toHaveBeenCalled();
    });
  });
});
