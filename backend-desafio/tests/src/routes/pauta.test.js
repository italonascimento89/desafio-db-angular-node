import request from 'supertest';
import express from 'express';
import { PautaController } from '../../../src/controllers/pautaController.js';

describe('PautaController', () => {
  let app;
  let pautaServiceMock;
  let userServiceMock;
  let pautaController;

  beforeEach(() => {
    pautaServiceMock = {
      createPauta: jest.fn(),
      listPautas: jest.fn(),
      getPautaById: jest.fn(),
    };

    userServiceMock = {
      isUserAdmin: jest.fn(),
    };

    pautaController = new PautaController(pautaServiceMock, userServiceMock);

    app = express();
    app.use(express.json());
    app.post('/v1/pautas', pautaController.createPauta);
    app.get('/v1/pautas', pautaController.listPautas);
    app.get('/v1/pautas/:id', pautaController.getPautaById);
  });

  describe('POST /v1/pautas', () => {
    it('deve criar pauta com sucesso', async () => {
      userServiceMock.isUserAdmin.mockResolvedValue();
      const pautaMock = { id: '1', nome: 'Pauta 1', descricao: 'desc' };
      pautaServiceMock.createPauta.mockResolvedValue(pautaMock);

      const res = await request(app).post('/v1/pautas').send({
        nome: 'Pauta 1',
        descricao: 'desc',
        tempo_aberta: 1,
        id_admin: 'admin1',
        categoria: 'Administrativo'
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(pautaMock);
    });

    it('deve retornar 400 se usuário não for admin', async () => {
      userServiceMock.isUserAdmin.mockRejectedValue(new Error('FORBIDDEN'));

      const res = await request(app).post('/v1/pautas').send({
        nome: 'Pauta 1',
        descricao: 'desc',
        tempo_aberta: 1,
        id_admin: 'nonadmin',
        categoria: 'Administrativo'
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Permissão negada, só administrador pode criar pauta.' });
    });

    it('deve retornar 409 se pauta já existe', async () => {
      userServiceMock.isUserAdmin.mockResolvedValue();
      pautaServiceMock.createPauta.mockRejectedValue(new Error('PAUTA_EXISTS'));

      const res = await request(app).post('/v1/pautas').send({
        nome: 'Pauta 1',
        descricao: 'desc',
        tempo_aberta: 1,
        id_admin: 'admin1',
        categoria: 'Administrativo'
      });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'Já existe uma pauta com este nome.' });
    });
  });

  describe('GET /v1/pautas', () => {
    it('deve listar pautas com paginação', async () => {
      const paginacaoMock = {
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
        pautas: [{ id: '1', nome: 'Pauta 1', descricao: 'desc' }],
      };
      pautaServiceMock.listPautas.mockResolvedValue(paginacaoMock);

      const res = await request(app).get('/v1/pautas');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(paginacaoMock);
    });
  });

  describe('GET /v1/pautas/:id', () => {
    it('deve retornar pauta por ID', async () => {
      const pautaMock = { id: '1', nome: 'Pauta 1', descricao: 'desc' };
      pautaServiceMock.getPautaById.mockResolvedValue(pautaMock);

      const res = await request(app).get('/v1/pautas/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(pautaMock);
    });

    it('deve retornar 404 se pauta não encontrada', async () => {
      pautaServiceMock.getPautaById.mockRejectedValue(new Error('NOT_FOUND'));

      const res = await request(app).get('/v1/pautas/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Pauta não encontrada' });
    });
  });
});
