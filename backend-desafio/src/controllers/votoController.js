export class VotoController {
  constructor(votoService) {
    this.votoService = votoService;
  }

  votar = async (req, res) => {
    const { cpf, id_pauta, voto } = req.body;

    try {
      console.info("Iniciando votação.")
      const result = await this.votoService.votar(cpf, id_pauta, voto);
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      if (err.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      if (err.message === 'PAUTA_NOT_FOUND') {
        return res.status(404).json({ error: 'Pauta não encontrada' });
      }
      if (err.message === 'PAUTA_EXPIRED') {
        return res.status(400).json({ error: 'Pauta encerrada para votação' });
      }
      if (err.message === 'ALREADY_VOTED') {
        return res.status(409).json({ error: 'Usuário já votou nessa pauta' });
      }
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  };

  getVotingResult = async (req, res) => {
    try {
      console.info("Iniciando busca resultado votação.")
      const { idPauta } = req.params;
      const result = await this.votoService.getVotingResult(idPauta);
      res.json(result);
    } catch (err) {
      console.error(err);
      if (err.message === 'PAUTA_NOT_FOUND') {
        return res.status(404).json({ error: 'Pauta não encontrada' });
      }
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  };
}
