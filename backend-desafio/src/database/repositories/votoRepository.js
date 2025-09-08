import { Voto } from '../../models/Voto.js';

export class VotoRepository {
  // Criar um voto
  async create(cpf, pautaId, voto) {
    const novoVoto = await Voto.create({
      cpf,
      pauta_id: pautaId,
      voto
    });
    return novoVoto;
  }

  // Buscar voto por cpf e pauta
  async findByCpfAndPauta(cpf, pautaId) {
    const voto = await Voto.findOne({
      where: {
        cpf,
        pauta_id: pautaId
      }
    });
    return voto;
  }

  // Contar votos "sim" e "nao" de uma pauta
  async countVotesByPauta(pautaId) {
    const votos = await Voto.findAll({
      attributes: [
        [Voto.sequelize.fn('COUNT', Voto.sequelize.col('id')), 'total'],
        [Voto.sequelize.fn('SUM', Voto.sequelize.literal(`CASE WHEN voto = 'sim' THEN 1 ELSE 0 END`)), 'sim'],
        [Voto.sequelize.fn('SUM', Voto.sequelize.literal(`CASE WHEN voto = 'nao' THEN 1 ELSE 0 END`)), 'nao']
      ],
      where: {
        pauta_id: pautaId
      },
      raw: true
    });

    // Retorna o primeiro elemento (objeto)
    return votos[0];
  }
}
