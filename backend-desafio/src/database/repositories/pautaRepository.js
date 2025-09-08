// src/database/repositories/pautaRepository.js
import { Pauta } from '../../models/Pauta.js';

export class PautaRepository {
  async create(nome, descricao, tempoAberta, categoria) {
    return await Pauta.create({
      nome,
      descricao,
      tempo_aberta: tempoAberta,
      categoria,
    });
  }

  async findAll() {
    return await Pauta.findAll({ order: [['created_at', 'DESC']] });
  }

  async findById(pautaId) {
    return await Pauta.findByPk(pautaId);
  }

  async findByNome(nome) {
    return await Pauta.findOne({ where: { nome } });
  }

  async findAllPaginated(page, limit, categoria) {
    const offset = (page - 1) * limit;

    const where = categoria ? { categoria } : {};

    const { rows: pautas, count: total } = await Pauta.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return {
      pautas,
      total,
    };
  }
}
