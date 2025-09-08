import { isValidCPF } from '../validators/cpfValidator.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async isUserAdmin(id_admin) {
    const exists = await this.userRepository.findById(id_admin);
    
    if (!exists) {
      throw new Error('FORBIDDEN');
    }
  }

  async createUser(cpf, tipo) {
    const cleanCpf = cpf.replace(/[^\d]+/g, '');

    if (!isValidCPF(cleanCpf)) {
      throw new Error('INVALID_CPF');
    }

    if (!['admin', 'votante'].includes(tipo)) {
      throw new Error('INVALID_TYPE');
    }

    const exists = await this.userRepository.findByCpf(cleanCpf);
    
    if (exists) {
      throw new Error('CPF_EXISTS');
    }

    return await this.userRepository.create(cleanCpf, tipo);
  }

  async listUsers() {
    return await this.userRepository.findAll();
  }

  async buscarPorCpf(cpf) {
    if (!isValidCPF(cpf)) {
      throw new Error('INVALID_CPF');
    }

    const user = await this.userRepository.findByCpf(cpf);

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return user
  }
}
