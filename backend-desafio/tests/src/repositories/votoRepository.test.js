import { VotoRepository } from '../../../src/database/repositories/votoRepository.js';
import { Voto } from '../../../src/models/Voto.js';

jest.mock('../../../src/models/Voto.js');

describe('VotoRepository', () => {
  let votoRepository;

  beforeEach(() => {
    votoRepository = new VotoRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo voto', async () => {
      const votoMock = { id: '1', cpf: '12345678901', pauta_id: 'p1', voto: 'sim' };
      Voto.create.mockResolvedValue(votoMock);

      const result = await votoRepository.create('12345678901', 'p1', 'sim');

      expect(Voto.create).toHaveBeenCalledWith({
        cpf: '12345678901',
        pauta_id: 'p1',
        voto: 'sim'
      });
      expect(result).toEqual(votoMock);
    });
  });

  describe('findByCpfAndPauta', () => {
    it('deve retornar voto existente pelo cpf e pauta', async () => {
      const votoMock = { id: '1', cpf: '12345678901', pauta_id: 'p1', voto: 'sim' };
      Voto.findOne.mockResolvedValue(votoMock);

      const result = await votoRepository.findByCpfAndPauta('12345678901', 'p1');

      expect(Voto.findOne).toHaveBeenCalledWith({
        where: { cpf: '12345678901', pauta_id: 'p1' }
      });
      expect(result).toEqual(votoMock);
    });

    it('deve retornar null se voto não existir', async () => {
      Voto.findOne.mockResolvedValue(null);

      const result = await votoRepository.findByCpfAndPauta('00000000000', 'p1');

      expect(Voto.findOne).toHaveBeenCalledWith({
        where: { cpf: '00000000000', pauta_id: 'p1' }
      });
      expect(result).toBeNull();
    });
  });

  describe('countVotesByPauta', () => {
    it('deve retornar contagem de votos sim e nao', async () => {
      const votosMock = [{ total: 10, sim: 6, nao: 4 }];
      Voto.findAll.mockResolvedValue(votosMock);

      const result = await votoRepository.countVotesByPauta('p1');

      expect(Voto.findAll).toHaveBeenCalledWith({
        attributes: [
          [Voto.sequelize.fn('COUNT', Voto.sequelize.col('id')), 'total'],
          [Voto.sequelize.fn('SUM', Voto.sequelize.literal(`CASE WHEN voto = 'sim' THEN 1 ELSE 0 END`)), 'sim'],
          [Voto.sequelize.fn('SUM', Voto.sequelize.literal(`CASE WHEN voto = 'nao' THEN 1 ELSE 0 END`)), 'nao']
        ],
        where: { pauta_id: 'p1' },
        raw: true
      });

      expect(result).toEqual(votosMock[0]);
    });

    it('deve retornar undefined se não houver votos', async () => {
      Voto.findAll.mockResolvedValue([]);

      const result = await votoRepository.countVotesByPauta('p2');

      expect(result).toBeUndefined();
    });
  });
});
