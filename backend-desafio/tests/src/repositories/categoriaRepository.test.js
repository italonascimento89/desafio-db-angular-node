import { CategoriaRepository } from '../../../src/database/repositories/categoriaRepository.js';
import { Categoria } from '../../../src/models/Categoria.js';

jest.mock('../../../src/models/Categoria.js');

describe('CategoriaRepository', () => {
  let categoriaRepository;

  beforeEach(() => {
    categoriaRepository = new CategoriaRepository();
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('deve criar uma categoria', async () => {
      const categoriaMock = { id: '1', nome: 'Eletrônicos' };
      Categoria.create.mockResolvedValue(categoriaMock);

      const result = await categoriaRepository.criar('Eletrônicos');

      expect(Categoria.create).toHaveBeenCalledWith({ nome: 'Eletrônicos' });
      expect(result).toEqual(categoriaMock);
    });
  });

  describe('listar', () => {
    it('deve listar categorias em ordem ascendente', async () => {
      const categoriasMock = [
        { id: '1', nome: 'Alimentos' },
        { id: '2', nome: 'Eletrônicos' },
      ];
      Categoria.findAll.mockResolvedValue(categoriasMock);

      const result = await categoriaRepository.listar();

      expect(Categoria.findAll).toHaveBeenCalledWith({ order: [['nome', 'ASC']] });
      expect(result).toEqual(categoriasMock);
    });
  });

  describe('buscarPorNome', () => {
    it('deve retornar categoria existente pelo nome', async () => {
      const categoriaMock = { id: '1', nome: 'Eletrônicos' };
      Categoria.findOne.mockResolvedValue(categoriaMock);

      const result = await categoriaRepository.buscarPorNome('Eletrônicos');

      expect(Categoria.findOne).toHaveBeenCalledWith({ where: { nome: 'Eletrônicos' } });
      expect(result).toEqual(categoriaMock);
    });

    it('deve retornar null se categoria não existir', async () => {
      Categoria.findOne.mockResolvedValue(null);

      const result = await categoriaRepository.buscarPorNome('NãoExiste');

      expect(Categoria.findOne).toHaveBeenCalledWith({ where: { nome: 'NãoExiste' } });
      expect(result).toBeNull();
    });
  });
});
