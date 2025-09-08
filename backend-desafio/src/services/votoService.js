export class VotoService {
  constructor(votoRepository, userRepository, pautaRepository) {
    this.votoRepository = votoRepository;
    this.userRepository = userRepository;
    this.pautaRepository = pautaRepository;
  }

  async votar(cpf, pautaId, voto) {
    const user = await this.userRepository.findByCpf(cpf);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const pauta = await this.pautaRepository.findById(pautaId);
    if (!pauta) {
      throw new Error('PAUTA_NOT_FOUND');
    }

    const now = new Date();
    const createdAt = new Date(pauta.created_at);
    const expiresAt = new Date(createdAt.getTime() + pauta.tempo_aberta * 60000);

    if (now > expiresAt) {
      throw new Error('PAUTA_EXPIRED');
    }

    const votoExistente = await this.votoRepository.findByCpfAndPauta(cpf, pautaId);
    if (votoExistente) {
      throw new Error('ALREADY_VOTED');
    }

    return await this.votoRepository.create(cpf, pautaId, voto);
  }

  async getVotingResult(idPauta) {
    const pauta = await this.pautaRepository.findById(idPauta);
    if (!pauta) {
      throw new Error('PAUTA_NOT_FOUND');
    }

    const votes = await this.votoRepository.countVotesByPauta(idPauta);
    const totalSim = Number(votes.sim ?? 0);
    const totalNao = Number(votes.nao ?? 0);
    const total = totalSim + totalNao;

    let percSim = 0;
    let percNao = 0;

    if (total > 0) {
      // arredonda para inteiro e força soma = 100
      percSim = Math.round((totalSim / total) * 100);
      percNao = 100 - percSim;
    }

    const data_inicio = pauta.created_at;
    const data_fim = new Date(new Date(pauta.created_at).getTime() + pauta.tempo_aberta * 60000);

    // status da sessão
    const agora = new Date();
    const status_sessao = agora <= data_fim ? 'aberta' : 'encerrada';

    let resultado = 'parcial';

  if (status_sessao === 'encerrada') {
    if (total === 0) {
      resultado = 'anulada';
    } else if (percSim > 50) {
      resultado = 'aprovado';
    } else if (percSim < 50) {
      resultado = 'reprovado';
    } else {
      resultado = 'empate';
    }
  }

    return {
      id_pauta: pauta.id,
      nome: pauta.nome,
      descricao: pauta.descricao,
      data_inicio,
      data_fim,
      status_sessao,
      resultado,
      porcentagem_sim: percSim,
      porcentagem_nao: percNao,
      total_sim: totalSim,
      total_nao: totalNao,
      total: total
    };
  }
}
