import request from 'supertest';
import express from 'express';
import { UserController } from '../../../src/controllers/userController.js';

describe('UserController', () => {
  let app;
  let userServiceMock;
  let userController;

  beforeEach(() => {
    userServiceMock = {
      createUser: jest.fn(),
      isUserAdmin: jest.fn(),
      listUsers: jest.fn(),
      buscarPorCpf: jest.fn(),
    };

    userController = new UserController(userServiceMock);

    app = express();
    app.use(express.json());
    app.post('/v1/users/admin', userController.createUserAdmin);
    app.post('/v1/users/voters', userController.createUserVoters);
    app.get('/v1/users', userController.listUsers);
    app.get('/v1/users/:cpf', userController.buscarPorCpf);
  });

  describe('POST /v1/users/admin', () => {
    it('deve criar usuário admin com sucesso', async () => {
      const userMock = { id: '1', cpf: '123', tipo: 'admin' };
      userServiceMock.createUser.mockResolvedValue(userMock);

      const res = await request(app).post('/v1/users/admin').send({ cpf: '123' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(userMock);
    });

    it('deve retornar 400 para CPF inválido', async () => {
      userServiceMock.createUser.mockRejectedValue(new Error('INVALID_CPF'));

      const res = await request(app).post('/v1/users/admin').send({ cpf: '000' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'CPF inválido' });
    });

    it('deve retornar 409 se CPF já cadastrado', async () => {
      userServiceMock.createUser.mockRejectedValue(new Error('CPF_EXISTS'));

      const res = await request(app).post('/v1/users/admin').send({ cpf: '123' });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'CPF já cadastrado' });
    });
  });

  describe('POST /v1/users/voters', () => {
    it('deve criar usuário votante com sucesso', async () => {
      const userMock = { id: '2', cpf: '456', tipo: 'votante' };
      userServiceMock.isUserAdmin.mockResolvedValue();
      userServiceMock.createUser.mockResolvedValue(userMock);

      const res = await request(app)
        .post('/v1/users/voters')
        .send({ cpf: '456', id_admin: 'admin1' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(userMock);
    });

    it('deve retornar 400 se permissão negada', async () => {
      userServiceMock.isUserAdmin.mockRejectedValue(new Error('FORBIDDEN'));

      const res = await request(app)
        .post('/v1/users/voters')
        .send({ cpf: '456', id_admin: 'nonadmin' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'Permissão negada, só administrador pode registrar usuários votantes.',
      });
    });
  });

  describe('GET /v1/users', () => {
    it('deve listar usuários', async () => {
      const usersMock = [{ id: '1', cpf: '123', tipo: 'admin' }];
      userServiceMock.listUsers.mockResolvedValue(usersMock);

      const res = await request(app).get('/v1/users');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(usersMock);
    });
  });

  describe('GET /v1/users/:cpf', () => {
    it('deve retornar usuário por CPF', async () => {
      const userMock = { id: '1', cpf: '123', tipo: 'admin' };
      userServiceMock.buscarPorCpf.mockResolvedValue(userMock);

      const res = await request(app).get('/v1/users/123');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(userMock);
    });

    it('deve retornar 400 para CPF inválido', async () => {
      userServiceMock.buscarPorCpf.mockRejectedValue(new Error('INVALID_CPF'));

      const res = await request(app).get('/v1/users/000');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'CPF inválido' });
    });

    it('deve retornar 404 se usuário não encontrado', async () => {
      userServiceMock.buscarPorCpf.mockRejectedValue(new Error('USER_NOT_FOUND'));

      const res = await request(app).get('/v1/users/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Usuário não encontrada' });
    });
  });
});
