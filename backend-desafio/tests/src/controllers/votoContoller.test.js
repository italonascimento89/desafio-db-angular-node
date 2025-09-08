import request from 'supertest';
import express from 'express';
import { VotoController } from '../../../src/controllers/votoController.js';

describe('VotoController', () => {
  let app;
  let votoServiceMock;
  let votoController;

  beforeEach(() => {
    votoServiceMock = {
      votar: jest.fn(),
      getVotingResult: jest.fn(),
    };

    votoController = new VotoController(votoServiceMock);

    app = express();
    app.use(express.json());
    app.post('/v1/votos', votoController.votar);
    app.get('/v1/votos/resultado/:idPauta', votoController.getVotingResult);

    jest.spyOn(console, 'error').mockImplementation(() => {}); // Silencia logs de erro
  });

  describe('POST /v1/votos', () => {
    it('deve registrar um voto com sucesso', async () => {
      const votoMock = { cpf: '52998224725', id_pauta: '1', voto: 'sim' };
      votoServiceMock.votar.mockResolvedValue(votoMock);

      const res = await request(app).post('/v1/votos').send(votoMock);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(votoMock);
    });

    it('deve retornar 404 se usuário não encontrado', async () => {
      votoServiceMock.votar.mockRejectedValue(new Error('USER_NOT_FOUND'));

      const res = await request(app).post('/v1/votos').send({
        cpf: '00000000000',
        id_pauta: '1',
        voto: 'sim',
      });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Usuário não encontrado' });
    });

    it('deve retornar 404 se pauta não encontrada', async () => {
      votoServiceMock.votar.mockRejectedValue(new Error('PAUTA_NOT_FOUND'));

      const res = await request(app).post('/v1/votos').send({
        cpf: '52998224725',
        id_pauta: '999',
        voto: 'sim',
      });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Pauta não encontrada' });
    });

    it('deve retornar 400 se pauta expirada', async () => {
      votoServiceMock.votar.mockRejectedValue(new Error('PAUTA_EXPIRED'));

      const res = await request(app).post('/v1/votos').send({
        cpf: '52998224725',
        id_pauta: '1',
        voto: 'sim',
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Pauta encerrada para votação' });
    });

    it('deve retornar 409 se usuário já votou', async () => {
      votoServiceMock.votar.mockRejectedValue(new Error('ALREADY_VOTED'));

      const res = await request(app).post('/v1/votos').send({
        cpf: '52998224725',
        id_pauta: '1',
        voto: 'sim',
      });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'Usuário já votou nessa pauta' });
    });

    it('deve retornar 500 para erro desconhecido', async () => {
      votoServiceMock.votar.mockRejectedValue(new Error('Erro desconhecido'));

      const res = await request(app).post('/v1/votos').send({
        cpf: '52998224725',
        id_pauta: '1',
        voto: 'sim',
      });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Erro no servidor' });
    });
  });

  describe('GET /v1/votos/resultado/:idPauta', () => {
    it('deve retornar resultado da votação', async () => {
      const resultMock = { id_pauta: '1', resultado: 'aprovado' };
      votoServiceMock.getVotingResult.mockResolvedValue(resultMock);

      const res = await request(app).get('/v1/votos/resultado/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(resultMock);
    });

    it('deve retornar 404 se pauta não encontrada', async () => {
      votoServiceMock.getVotingResult.mockRejectedValue(new Error('PAUTA_NOT_FOUND'));

      const res = await request(app).get('/v1/votos/resultado/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Pauta não encontrada' });
    });

    it('deve retornar 500 para erro desconhecido', async () => {
      votoServiceMock.getVotingResult.mockRejectedValue(new Error('Erro desconhecido'));

      const res = await request(app).get('/v1/votos/resultado/1');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Erro no servidor' });
    });
  });
});
