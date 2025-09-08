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
      getVotingResult: jest.fn()
    };

    votoController = new VotoController(votoServiceMock);

    app = express();
    app.use(express.json());
    app.post('/v1/votos', votoController.votar);
    app.get('/v1/votos/resultado/:idPauta', votoController.getVotingResult);
  });

  describe('POST /v1/votos', () => {
    it('deve registrar um voto com sucesso', async () => {
      votoServiceMock.votar.mockResolvedValue({ id: '1', cpf: '123', voto: 'sim' });

      const res = await request(app)
        .post('/v1/votos')
        .send({ cpf: '123', id_pauta: 'p1', voto: 'sim' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: '1', cpf: '123', voto: 'sim' });
    });

    it('deve retornar 404 se usuário não encontrado', async () => {
      votoServiceMock.votar.mockRejectedValue(new Error('USER_NOT_FOUND'));

      const res = await request(app)
        .post('/v1/votos')
        .send({ cpf: '000', id_pauta: 'p1', voto: 'sim' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Usuário não encontrado' });
    });

    it('deve retornar 404 se pauta não encontrada', async () => {
      votoServiceMock.votar.mockRejectedValue(new Error('PAUTA_NOT_FOUND'));

      const res = await request(app)
        .post('/v1/votos')
        .send({ cpf: '123', id_pauta: 'pX', voto: 'sim' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Pauta não encontrada' });
    });

    it('deve retornar 400 se pauta encerrada', async () => {
      votoServiceMock.votar.mockRejectedValue(new Error('PAUTA_EXPIRED'));

      const res = await request(app)
        .post('/v1/votos')
        .send({ cpf: '123', id_pauta: 'p1', voto: 'sim' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Pauta encerrada para votação' });
    });

    it('deve retornar 409 se usuário já votou', async () => {
      votoServiceMock.votar.mockRejectedValue(new Error('ALREADY_VOTED'));

      const res = await request(app)
        .post('/v1/votos')
        .send({ cpf: '123', id_pauta: 'p1', voto: 'sim' });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'Usuário já votou nessa pauta' });
    });
  });

  describe('GET /v1/votos/resultado/:idPauta', () => {
    it('deve retornar o resultado da votação', async () => {
      const resultMock = {
        id_pauta: 'p1',
        nome: 'Pauta Teste',
        descricao: 'Descrição teste',
        data_inicio: new Date().toISOString(),
        data_fim: new Date().toISOString(),
        status_sessao: 'aberta',
        resultado: 'parcial',
        porcentagem_sim: 60,
        porcentagem_nao: 40,
        total_sim: 6,
        total_nao: 4,
        total: 10
      };
      votoServiceMock.getVotingResult.mockResolvedValue(resultMock);

      const res = await request(app).get('/v1/votos/resultado/p1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(resultMock);
    });

    it('deve retornar 404 se pauta não encontrada', async () => {
      votoServiceMock.getVotingResult.mockRejectedValue(new Error('PAUTA_NOT_FOUND'));

      const res = await request(app).get('/v1/votos/resultado/invalid');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Pauta não encontrada' });
    });
  });
});
