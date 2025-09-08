import { PautaResultadoPipe } from './pauta-resultado.pipe';
import { IPautaDetalhes } from '../interfaces/pauta-detalhes.interface';

describe('PautaResultadoPipe', () => {
  let pipe: PautaResultadoPipe;

  beforeEach(() => {
    pipe = new PautaResultadoPipe();
  });

  it('deve criar o pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve retornar mensagem correta para pauta aprovada', () => {
    const pauta: IPautaDetalhes = {
      id_pauta: '1',
      nome: 'Teste Pauta',
      descricao: 'Descrição da pauta',
      resultado: 'aprovado',
      status_sessao: 'aberta',
      data_fim: '2025-09-09T05:13:35.762Z',
      data_inicio: '2025-09-07T23:13:35.762Z',
      porcentagem_sim: 75,
      porcentagem_nao: 25,
      total: 100,
      total_nao: 75,
      total_sim: 25,
    };
    const resultado = pipe.transform(pauta);
    expect(resultado).toBe('Sessão encerrada. Pauta aprovada com 75% dos votos');
  });

  it('deve retornar mensagem correta para pauta anulada', () => {
    const pauta: IPautaDetalhes = {
      id_pauta: '1',
      nome: 'Teste Pauta',
      descricao: 'Descrição da pauta',
      resultado: 'anulada',
      status_sessao: 'aberta',
      data_fim: '2025-09-09T05:13:35.762Z',
      data_inicio: '2025-09-07T23:13:35.762Z',
      porcentagem_sim: 0,
      porcentagem_nao: 0,
      total: 0,
      total_nao: 0,
      total_sim: 0,
    };
    const resultado = pipe.transform(pauta);
    expect(resultado).toBe('Sessão encerrada. Pauta anulada ');
  });

  it('deve retornar mensagem correta para pauta com empate', () => {
    const pauta: IPautaDetalhes = {
      id_pauta: '1',
      nome: 'Teste Pauta',
      descricao: 'Descrição da pauta',
      resultado: 'empate',
      status_sessao: 'aberta',
      data_fim: '2025-09-09T05:13:35.762Z',
      data_inicio: '2025-09-07T23:13:35.762Z',
      porcentagem_sim: 50,
      porcentagem_nao: 50,
      total: 100,
      total_nao: 50,
      total_sim: 50,
    };
    const resultado = pipe.transform(pauta);
    expect(resultado).toBe('Sessão encerrada. Pauta não aprovada por empate de votos.');
  });

  it('deve retornar mensagem correta para pauta reprovada', () => {
    const pauta: IPautaDetalhes = {
      id_pauta: '1',
      nome: 'Teste Pauta',
      descricao: 'Descrição da pauta',
      resultado: 'reprovado',
      status_sessao: 'aberta',
      data_fim: '2025-09-09T05:13:35.762Z',
      data_inicio: '2025-09-07T23:13:35.762Z',
      porcentagem_sim: 30,
      porcentagem_nao: 70,
      total: 100,
      total_nao: 70,
      total_sim: 30,
    };
    const resultado = pipe.transform(pauta);
    expect(resultado).toBe('Sessão encerrada. Pauta reprovada com 70% de votos');
  });

  it('deve lidar com valores indefinidos sem lançar erro', () => {
    const pauta: any = { resultado: undefined, porcentagem_nao: 0, porcentagem_sim: 0 };
    const resultado = pipe.transform(pauta);
    expect(resultado).toBe('Sessão encerrada. Pauta reprovada com 0% de votos');
  });
});
