import { User } from '../../models/User.js';

export class UserRepository {
  async create(cpf, tipo) {
    return await User.create({ cpf, tipo });
  }

  async findAll() {
    return await User.findAll();
  }

  async findByCpf(cpf) {
    return await User.findOne({ where: { cpf } });
  }

  async findById(id_admin) {
    return await User.findOne({
      where: {
        id: id_admin,
        tipo: 'admin',
      },
    });
  }
}
