import { PautaService } from '../../../src/services/pautaService.js';

describe('PautaService', () => {
  let pautaRepositoryMock;
  let pautaService;

  beforeEach(() => {
    pautaRepositoryMock = {
      findByNome: jest.fn(),
      create: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
    };

    pautaService = new PautaService(pautaRepositoryMock);
  });

  describe('createPauta', () => {
    it('deve criar uma pauta com sucesso', async () => {
      pautaRepositoryMock.findByNome.mockResolvedValue(null);
      pautaRepositoryMock.create.mockResolvedValue({ id: 'uuid', nome: 'Pauta 1', descricao: 'Desc', tempo_aberta: 10, categoria: 'cat' });

      const result = await pautaService.createPauta('Pauta 1', 'Desc', 10, 'cat');

      expect(result).toEqual({ id: 'uuid', nome: 'Pauta 1', descricao: 'Desc', tempo_aberta: 10, categoria: 'cat' });
    });

    it('deve lançar PAUTA_EXISTS se já existir pauta com mesmo nome', async () => {
      pautaRepositoryMock.findByNome.mockResolvedValue({ id: 'uuid', nome: 'Pauta 1' });

      await expect(pautaService.createPauta('Pauta 1', 'Desc', 10, 'cat')).rejects.toThrow('PAUTA_EXISTS');
    });
  });

  describe('listPautas', () => {
    it('deve listar pautas com status calculado', async () => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - 5 * 60000); // 5 minutos atrás
      pautaRepositoryMock.findAllPaginated.mockResolvedValue({
        pautas: [
          { id: '1', nome: 'P1', descricao: 'Desc', tempo_aberta: 10, created_at: createdAt, categoria: 'cat' },
          { id: '2', nome: 'P2', descricao: 'Desc', tempo_aberta: 3, created_at: createdAt, categoria: 'cat' },
        ],
        total: 2
      });

      const result = await pautaService.listPautas(1, 10);

      expect(result.pautas).toHaveLength(2);
      expect(result.pautas[0]).toHaveProperty('status', 'ABERTA');
      expect(result.pautas[1]).toHaveProperty('status', 'ENCERRADA');
    });

    it('deve aplicar filtro de status se fornecido', async () => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - 5 * 60000);
      pautaRepositoryMock.findAllPaginated.mockResolvedValue({
        pautas: [
          { id: '1', nome: 'P1', descricao: 'Desc', tempo_aberta: 10, created_at: createdAt, categoria: 'cat' },
          { id: '2', nome: 'P2', descricao: 'Desc', tempo_aberta: 3, created_at: createdAt, categoria: 'cat' },
        ],
        total: 2
      });

      const result = await pautaService.listPautas(1, 10, 'ABERTA');

      expect(result.pautas.every(p => p.status === 'ABERTA')).toBe(true);
    });
  });

  describe('getPautaById', () => {
    it('deve retornar pauta formatada', async () => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - 5 * 60000);
      pautaRepositoryMock.findById.mockResolvedValue({
        id: '1', nome: 'P1', descricao: 'Desc', tempo_aberta: 10, created_at: createdAt, categoria: 'cat'
      });

      const result = await pautaService.getPautaById('1');

      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('status', 'ABERTA');
      expect(result).toHaveProperty('tempo_restante');
    });

    it('deve lançar NOT_FOUND se pauta não encontrada', async () => {
      pautaRepositoryMock.findById.mockResolvedValue(null);

      await expect(pautaService.getPautaById('1')).rejects.toThrow('NOT_FOUND');
    });
  });

  describe('formatPauta', () => {
    it('deve calcular status ABERTA e tempo restante', () => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - 2 * 60000); // 2 minutos atrás
      const pauta = { id: '1', nome: 'P1', descricao: 'Desc', tempo_aberta: 5, created_at: createdAt, categoria: 'cat' };

      const result = pautaService.formatPauta(pauta, now);

      expect(result.status).toBe('ABERTA');
      expect(result.tempo_restante).toBeGreaterThan(0);
    });

    it('deve calcular status ENCERRADA e tempo restante 0', () => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - 10 * 60000); // 10 minutos atrás
      const pauta = { id: '1', nome: 'P1', descricao: 'Desc', tempo_aberta: 5, created_at: createdAt, categoria: 'cat' };

      const result = pautaService.formatPauta(pauta, now);

      expect(result.status).toBe('ENCERRADA');
      expect(result.tempo_restante).toBe(0);
    });
  });
});
