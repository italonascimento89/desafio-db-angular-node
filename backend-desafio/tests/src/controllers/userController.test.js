import { UserController } from '../../../src/controllers/userController.js';

describe('UserController', () => {
  let userServiceMock;
  let userController;
  let req;
  let res;

  beforeEach(() => {
    userServiceMock = {
      createUser: jest.fn(),
      isUserAdmin: jest.fn(),
      listUsers: jest.fn(),
      buscarPorCpf: jest.fn(),
    };

    userController = new UserController(userServiceMock);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(console, 'error').mockImplementation(() => {}); // Silencia logs de erro
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUserAdmin', () => {
    it('deve criar usuário admin com sucesso', async () => {
      const user = { id: 'uuid', cpf: '12345678900', tipo: 'admin' };
      userServiceMock.createUser.mockResolvedValue(user);

      req.body = { cpf: '12345678900' };
      await userController.createUserAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('deve retornar 400 se CPF inválido', async () => {
      userServiceMock.createUser.mockRejectedValue(new Error('INVALID_CPF'));

      req.body = { cpf: '000' };
      await userController.createUserAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'CPF inválido' });
    });

    it('deve retornar 409 se CPF já existe', async () => {
      userServiceMock.createUser.mockRejectedValue(new Error('CPF_EXISTS'));

      req.body = { cpf: '12345678900' };
      await userController.createUserAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'CPF já cadastrado' });
    });
  });

  describe('createUserVoters', () => {
    it('deve criar usuário votante com sucesso', async () => {
      const user = { id: 'uuid', cpf: '12345678900', tipo: 'votante' };
      userServiceMock.createUser.mockResolvedValue(user);
      userServiceMock.isUserAdmin.mockResolvedValue(true);

      req.body = { cpf: '12345678900', id_admin: 'admin-uuid' };
      await userController.createUserVoters(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('deve retornar 400 se administrador não autorizado', async () => {
      userServiceMock.isUserAdmin.mockRejectedValue(new Error('FORBIDDEN'));

      req.body = { cpf: '12345678900', id_admin: 'invalid-admin' };
      await userController.createUserVoters(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Permissão negada, só administrador pode registrar usuários votantes.',
      });
    });

    it('deve retornar 409 se CPF já cadastrado', async () => {
      userServiceMock.isUserAdmin.mockResolvedValue(true);
      userServiceMock.createUser.mockRejectedValue(new Error('CPF_EXISTS'));

      req.body = { cpf: '12345678900', id_admin: 'admin-uuid' };
      await userController.createUserVoters(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'CPF já cadastrado' });
    });
  });

  describe('listUsers', () => {
    it('deve retornar lista de usuários', async () => {
      const users = [{ cpf: '123', tipo: 'admin' }];
      userServiceMock.listUsers.mockResolvedValue(users);

      await userController.listUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe('buscarPorCpf', () => {
    it('deve retornar usuário existente', async () => {
      const user = { cpf: '123', tipo: 'votante' };
      userServiceMock.buscarPorCpf.mockResolvedValue(user);

      req.params = { cpf: '123' };
      await userController.buscarPorCpf(req, res);

      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('deve retornar 404 se usuário não encontrado', async () => {
      userServiceMock.buscarPorCpf.mockRejectedValue(new Error('USER_NOT_FOUND'));

      req.params = { cpf: '000' };
      await userController.buscarPorCpf(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrada' });
    });

    it('deve retornar 400 se CPF inválido', async () => {
      userServiceMock.buscarPorCpf.mockRejectedValue(new Error('INVALID_CPF'));

      req.params = { cpf: '000' };
      await userController.buscarPorCpf(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'CPF inválido' });
    });
  });
});
