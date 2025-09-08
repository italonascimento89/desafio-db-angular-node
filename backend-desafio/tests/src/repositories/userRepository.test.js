import { UserRepository } from '../../../src/database/repositories/userRepository.js';
import { User } from '../../../src/models/User.js';

jest.mock('../../../src/models/User.js'); // Mock do model Sequelize

describe('UserRepository', () => {
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      const userMock = { id: '1', cpf: '12345678901', tipo: 'admin' };
      User.create.mockResolvedValue(userMock);

      const result = await userRepository.create('12345678901', 'admin');

      expect(User.create).toHaveBeenCalledWith({ cpf: '12345678901', tipo: 'admin' });
      expect(result).toEqual(userMock);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      const usersMock = [{ id: '1' }, { id: '2' }];
      User.findAll.mockResolvedValue(usersMock);

      const result = await userRepository.findAll();

      expect(User.findAll).toHaveBeenCalled();
      expect(result).toEqual(usersMock);
    });
  });

  describe('findByCpf', () => {
    it('deve retornar usuário pelo CPF', async () => {
      const userMock = { id: '1', cpf: '12345678901' };
      User.findOne.mockResolvedValue(userMock);

      const result = await userRepository.findByCpf('12345678901');

      expect(User.findOne).toHaveBeenCalledWith({ where: { cpf: '12345678901' } });
      expect(result).toEqual(userMock);
    });

    it('deve retornar null se usuário não encontrado', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await userRepository.findByCpf('00000000000');

      expect(User.findOne).toHaveBeenCalledWith({ where: { cpf: '00000000000' } });
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('deve retornar admin pelo id', async () => {
      const adminMock = { id: '1', tipo: 'admin' };
      User.findOne.mockResolvedValue(adminMock);

      const result = await userRepository.findById('1');

      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: '1', tipo: 'admin' },
      });
      expect(result).toEqual(adminMock);
    });

    it('deve retornar null se admin não encontrado', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await userRepository.findById('999');

      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: '999', tipo: 'admin' },
      });
      expect(result).toBeNull();
    });
  });
});
