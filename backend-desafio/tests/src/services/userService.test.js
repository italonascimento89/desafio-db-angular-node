import { UserService } from '../../../src/services/userService.js';
import { isValidCPF } from '../../../src/validators/cpfValidator.js';

jest.mock('../../../src/validators/cpfValidator.js');

describe('UserService', () => {
  let userRepositoryMock;
  let userService;

  beforeEach(() => {
    userRepositoryMock = {
      findById: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    userService = new UserService(userRepositoryMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isUserAdmin', () => {
    it('deve passar se usuário admin existe', async () => {
      userRepositoryMock.findById.mockResolvedValue({ id: 'admin-uuid' });

      await expect(userService.isUserAdmin('admin-uuid')).resolves.not.toThrow();
    });

    it('deve lançar FORBIDDEN se admin não existe', async () => {
      userRepositoryMock.findById.mockResolvedValue(null);

      await expect(userService.isUserAdmin('admin-uuid')).rejects.toThrow('FORBIDDEN');
    });
  });

  describe('createUser', () => {
    it('deve criar usuário com sucesso', async () => {
      isValidCPF.mockReturnValue(true);
      userRepositoryMock.findByCpf.mockResolvedValue(null);
      userRepositoryMock.create.mockResolvedValue({ id: 'uuid', cpf: '12345678900', tipo: 'admin' });

      const result = await userService.createUser('12345678900', 'admin');
      expect(result).toEqual({ id: 'uuid', cpf: '12345678900', tipo: 'admin' });
    });

    it('deve lançar INVALID_CPF se CPF inválido', async () => {
      isValidCPF.mockReturnValue(false);

      await expect(userService.createUser('000', 'admin')).rejects.toThrow('INVALID_CPF');
    });

    it('deve lançar INVALID_TYPE se tipo inválido', async () => {
      isValidCPF.mockReturnValue(true);

      await expect(userService.createUser('12345678900', 'invalid')).rejects.toThrow('INVALID_TYPE');
    });

    it('deve lançar CPF_EXISTS se CPF já cadastrado', async () => {
      isValidCPF.mockReturnValue(true);
      userRepositoryMock.findByCpf.mockResolvedValue({ id: 'uuid', cpf: '12345678900' });

      await expect(userService.createUser('12345678900', 'admin')).rejects.toThrow('CPF_EXISTS');
    });
  });

  describe('listUsers', () => {
    it('deve retornar lista de usuários', async () => {
      const users = [{ id: 'uuid', cpf: '12345678900', tipo: 'admin' }];
      userRepositoryMock.findAll.mockResolvedValue(users);

      const result = await userService.listUsers();
      expect(result).toEqual(users);
    });
  });

  describe('buscarPorCpf', () => {
    it('deve retornar usuário existente', async () => {
      isValidCPF.mockReturnValue(true);
      const user = { id: 'uuid', cpf: '12345678900', tipo: 'votante' };
      userRepositoryMock.findByCpf.mockResolvedValue(user);

      const result = await userService.buscarPorCpf('12345678900');
      expect(result).toEqual(user);
    });

    it('deve lançar INVALID_CPF se CPF inválido', async () => {
      isValidCPF.mockReturnValue(false);

      await expect(userService.buscarPorCpf('000')).rejects.toThrow('INVALID_CPF');
    });

    it('deve lançar USER_NOT_FOUND se usuário não encontrado', async () => {
      isValidCPF.mockReturnValue(true);
      userRepositoryMock.findByCpf.mockResolvedValue(null);

      await expect(userService.buscarPorCpf('12345678900')).rejects.toThrow('USER_NOT_FOUND');
    });
  });
});
