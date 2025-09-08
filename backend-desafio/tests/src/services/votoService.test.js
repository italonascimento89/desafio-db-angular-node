import { VotoService } from '../../../src/services/votoService.js';

describe('VotoService', () => {
  let votoRepositoryMock;
  let userRepositoryMock;
  let pautaRepositoryMock;
  let votoService;

  beforeEach(() => {
    votoRepositoryMock = {
      findByCpfAndPauta: jest.fn(),
      create: jest.fn(),
      countVotesByPauta: jest.fn(),
    };

    userRepositoryMock = {
      findByCpf: jest.fn(),
    };

    pautaRepositoryMock = {
      findById: jest.fn(),
    };

    votoService = new VotoService(votoRepositoryMock, userRepositoryMock, pautaRepositoryMock);
  });

  describe('votar', () => {
    const cpf = '12345678901';
    const pautaId = 'uuid-pauta';
    const voto = 'sim';

    it('deve registrar voto com sucesso', async () => {
      userRepositoryMock.findByCpf.mockResolvedValue({ id: 'user1', cpf });
      pautaRepositoryMock.findById.mockResolvedValue({ id: pautaId, created_at: new Date(Date.now() - 1000), tempo_aberta: 10 });
      votoRepositoryMock.findByCpfAndPauta.mockResolvedValue(null);
      votoRepositoryMock.create.mockResolvedValue({ id: 'voto1', cpf, pautaId, voto });

      const result = await votoService.votar(cpf, pautaId, voto);

      expect(result).toEqual({ id: 'voto1', cpf, pautaId, voto });
    });

    it('deve lançar USER_NOT_FOUND se usuário não existir', async () => {
      userRepositoryMock.findByCpf.mockResolvedValue(null);

      await expect(votoService.votar(cpf, pautaId, voto)).rejects.toThrow('USER_NOT_FOUND');
    });

    it('deve lançar PAUTA_NOT_FOUND se pauta não existir', async () => {
      userRepositoryMock.findByCpf.mockResolvedValue({ id: 'user1', cpf });
      pautaRepositoryMock.findById.mockResolvedValue(null);

      await expect(votoService.votar(cpf, pautaId, voto)).rejects.toThrow('PAUTA_NOT_FOUND');
    });

    it('deve lançar PAUTA_EXPIRED se sessão encerrada', async () => {
      userRepositoryMock.findByCpf.mockResolvedValue({ id: 'user1', cpf });
      pautaRepositoryMock.findById.mockResolvedValue({
        id: pautaId,
        created_at: new Date(Date.now() - 600000), // 10 minutos atrás
        tempo_aberta: 1, // expirada
      });

      await expect(votoService.votar(cpf, pautaId, voto)).rejects.toThrow('PAUTA_EXPIRED');
    });

    it('deve lançar ALREADY_VOTED se usuário já votou', async () => {
      userRepositoryMock.findByCpf.mockResolvedValue({ id: 'user1', cpf });
      pautaRepositoryMock.findById.mockResolvedValue({ id: pautaId, created_at: new Date(), tempo_aberta: 10 });
      votoRepositoryMock.findByCpfAndPauta.mockResolvedValue({ id: 'voto1' });

      await expect(votoService.votar(cpf, pautaId, voto)).rejects.toThrow('ALREADY_VOTED');
    });
  });

  describe('getVotingResult', () => {
    const pautaId = 'uuid-pauta';
    const now = new Date();

    it('deve retornar resultado da votação', async () => {
      pautaRepositoryMock.findById.mockResolvedValue({
        id: pautaId,
        nome: 'Pauta 1',
        descricao: 'Descrição',
        created_at: now,
        tempo_aberta: 10
      });

      votoRepositoryMock.countVotesByPauta.mockResolvedValue({ sim: 6, nao: 4 });

      const result = await votoService.getVotingResult(pautaId);

      expect(result).toMatchObject({
        id_pauta: pautaId,
        nome: 'Pauta 1',
        descricao: 'Descrição',
        total_sim: 6,
        total_nao: 4,
        total: 10,
        resultado: 'parcial',
      });
    });

    it('deve lançar PAUTA_NOT_FOUND se pauta não existir', async () => {
      pautaRepositoryMock.findById.mockResolvedValue(null);

      await expect(votoService.getVotingResult(pautaId)).rejects.toThrow('PAUTA_NOT_FOUND');
    });

    it('deve calcular corretamente resultado aprovado/reprovado quando sessão encerrada', async () => {
      const createdAt = new Date(Date.now() - 600000); // 10 minutos atrás
      pautaRepositoryMock.findById.mockResolvedValue({
        id: pautaId,
        nome: 'Pauta 1',
        descricao: 'Descrição',
        created_at: createdAt,
        tempo_aberta: 5 // 5 minutos, já encerrada
      });

      votoRepositoryMock.countVotesByPauta.mockResolvedValue({ sim: 7, nao: 3 });

      const result = await votoService.getVotingResult(pautaId);

      expect(result.status_sessao).toBe('encerrada');
      expect(result.resultado).toBe('aprovado');
      expect(result.porcentagem_sim).toBe(70);
      expect(result.porcentagem_nao).toBe(30);
    });
  });
});
