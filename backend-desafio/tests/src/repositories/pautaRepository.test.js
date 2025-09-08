import { PautaRepository } from '../../../src/database/repositories/pautaRepository.js';
import { Pauta } from '../../../src/models/Pauta.js';

jest.mock('../../../src/models/Pauta.js');

describe('PautaRepository', () => {
  let pautaRepository;

  beforeEach(() => {
    pautaRepository = new PautaRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma nova pauta', async () => {
      const pautaMock = { id: '1', nome: 'Nova Pauta', descricao: 'Descrição', tempo_aberta: 5, categoria: 'Categoria1' };
      Pauta.create.mockResolvedValue(pautaMock);

      const result = await pautaRepository.create('Nova Pauta', 'Descrição', 5, 'Categoria1');

      expect(Pauta.create).toHaveBeenCalledWith({
        nome: 'Nova Pauta',
        descricao: 'Descrição',
        tempo_aberta: 5,
        categoria: 'Categoria1',
      });
      expect(result).toEqual(pautaMock);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as pautas ordenadas por created_at desc', async () => {
      const pautasMock = [{ id: '1' }, { id: '2' }];
      Pauta.findAll.mockResolvedValue(pautasMock);

      const result = await pautaRepository.findAll();

      expect(Pauta.findAll).toHaveBeenCalledWith({ order: [['created_at', 'DESC']] });
      expect(result).toEqual(pautasMock);
    });
  });

  describe('findById', () => {
    it('deve retornar a pauta pelo id', async () => {
      const pautaMock = { id: '1', nome: 'Pauta1' };
      Pauta.findByPk.mockResolvedValue(pautaMock);

      const result = await pautaRepository.findById('1');

      expect(Pauta.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual(pautaMock);
    });

    it('deve retornar null se não encontrar', async () => {
      Pauta.findByPk.mockResolvedValue(null);

      const result = await pautaRepository.findById('999');

      expect(Pauta.findByPk).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });

  describe('findByNome', () => {
    it('deve retornar a pauta pelo nome', async () => {
      const pautaMock = { id: '1', nome: 'Pauta1' };
      Pauta.findOne.mockResolvedValue(pautaMock);

      const result = await pautaRepository.findByNome('Pauta1');

      expect(Pauta.findOne).toHaveBeenCalledWith({ where: { nome: 'Pauta1' } });
      expect(result).toEqual(pautaMock);
    });

    it('deve retornar null se não encontrar', async () => {
      Pauta.findOne.mockResolvedValue(null);

      const result = await pautaRepository.findByNome('Inexistente');

      expect(Pauta.findOne).toHaveBeenCalledWith({ where: { nome: 'Inexistente' } });
      expect(result).toBeNull();
    });
  });

  describe('findAllPaginated', () => {
    it('deve retornar pautas paginadas com total', async () => {
      const pautasMock = [{ id: '1' }, { id: '2' }];
      const totalMock = 10;
      Pauta.findAndCountAll.mockResolvedValue({ rows: pautasMock, count: totalMock });

      const result = await pautaRepository.findAllPaginated(2, 5, 'Categoria1');

      expect(Pauta.findAndCountAll).toHaveBeenCalledWith({
        where: { categoria: 'Categoria1' },
        order: [['created_at', 'DESC']],
        limit: 5,
        offset: 5,
      });

      expect(result).toEqual({ pautas: pautasMock, total: totalMock });
    });

    it('deve retornar pautas paginadas sem filtro de categoria', async () => {
      const pautasMock = [{ id: '1' }];
      const totalMock = 1;
      Pauta.findAndCountAll.mockResolvedValue({ rows: pautasMock, count: totalMock });

      const result = await pautaRepository.findAllPaginated(1, 10);

      expect(Pauta.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [['created_at', 'DESC']],
        limit: 10,
        offset: 0,
      });

      expect(result).toEqual({ pautas: pautasMock, total: totalMock });
    });
  });
});
