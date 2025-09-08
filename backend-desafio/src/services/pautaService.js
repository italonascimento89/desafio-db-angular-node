export class PautaService {
  constructor(pautaRepository) {
    this.pautaRepository = pautaRepository;
  }

  async createPauta(nome, descricao, tempoAberta, categoria) {
    const exists = await this.pautaRepository.findByNome(nome);
    
    if (exists) {
      throw new Error('PAUTA_EXISTS');
    }

    return await this.pautaRepository.create(nome, descricao, tempoAberta, categoria);
  }

  async listPautas(page, limit, status, categoria) {
    const { pautas, total } = await this.pautaRepository.findAllPaginated(page, limit, categoria);

    const now = new Date();

    let pautasFormatadas = pautas.map(pauta => {
      const dataInicio = new Date(pauta.created_at);
      const dataFim = new Date(dataInicio.getTime() + pauta.tempo_aberta * 60000);
      const statusCalculado = now <= dataFim ? 'ABERTA' : 'ENCERRADA';

      const tempoRestanteMs = Math.max(dataFim - now, 0);
      const tempoRestanteMin = Math.floor(tempoRestanteMs / 60000);

      return {
        id: pauta.id,
        nome: pauta.nome,
        descricao: pauta.descricao,
        categoria: pauta.categoria,
        status: statusCalculado,
        tempo_restante: statusCalculado === 'ABERTA' ? tempoRestanteMin : 0,
      };
    });

    // Aplica o filtro de status, se informado
    if (status) {
      const statusUpper = status.toUpperCase();
      pautasFormatadas = pautasFormatadas.filter(p => p.status === statusUpper);
    }

    return {
      page,
      limit,
      total: status ? pautasFormatadas.length : total,
      total_pages: Math.ceil((status ? pautasFormatadas.length : total) / limit),
      pautas: pautasFormatadas,
    };
  }

  async getPautaById(id) {
    const pauta = await this.pautaRepository.findById(id);
    if (!pauta) {
      throw new Error('NOT_FOUND');
    }

    return this.formatPauta(pauta, new Date());
  }

  formatPauta(pauta, now) {
    const dataInicio = new Date(pauta.created_at);
    const dataFim = new Date(dataInicio.getTime() + pauta.tempo_aberta * 60000);
    const status = now <= dataFim ? 'ABERTA' : 'ENCERRADA';

    const tempoRestanteMs = Math.max(dataFim - now, 0);
    const tempoRestanteMin = Math.floor(tempoRestanteMs / 60000);

    return {
      id: pauta.id,
      nome: pauta.nome,
      categoria: pauta.categoria,
      descricao: pauta.descricao,
      status,
      tempo_restante: status === 'ABERTA' ? tempoRestanteMin : 0,
    };
  }
}
