import { PercentualVotosPipe } from './percentual-votos.pipe';
import { IPautaDetalhes } from '../interfaces/pauta-detalhes.interface';

describe('PercentualVotosPipe', () => {
  let pipe: PercentualVotosPipe;

  beforeEach(() => {
    pipe = new PercentualVotosPipe();
  });

  it('deve criar o pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve retornar "--" se o percentual_nao for undefined e tipo "não"', () => {
    const pautaReprovada: IPautaDetalhes = {
      id_pauta: '1',
      nome: 'Teste',
      descricao: 'Descrição',
      data_inicio: new Date().toISOString(),
      data_fim: new Date().toISOString(),
      resultado: 'reprovado',
      porcentagem_sim: 60,
      porcentagem_nao: undefined as any,
      status_sessao: 'encerrada',
      total_sim: 60,
      total_nao: 40, // caso queira um valor, senão deixar como undefined
      total: 100,
    };

    const resultado = pipe.transform(pautaReprovada, 'nao');
    expect(resultado).toBe('--');
  });

  it('deve retornar percentual correto para tipo "sim"', () => {
    const pautaAprovada: IPautaDetalhes = {
      id_pauta: '1',
      nome: 'Teste',
      descricao: 'Descrição',
      data_inicio: new Date().toISOString(),
      data_fim: new Date().toISOString(),
      resultado: 'aprovado',
      porcentagem_sim: 70,
      porcentagem_nao: 30,
      status_sessao: 'encerrada',
      total_sim: 70,
      total_nao: 30,
      total: 100,
    };

    const resultado = pipe.transform(pautaAprovada, 'sim');
    expect(resultado).toBe('70%');
  });

  it('deve retornar percentual correto para tipo "não"', () => {
    const pautaAprovada: IPautaDetalhes = {
      id_pauta: '1',
      nome: 'Teste',
      descricao: 'Descrição',
      data_inicio: new Date().toISOString(),
      data_fim: new Date().toISOString(),
      resultado: 'aprovado',
      porcentagem_sim: 70,
      porcentagem_nao: 45,
      status_sessao: 'encerrada',
      total_sim: 70,
      total_nao: 30,
      total: 100,
    };

    const resultado = pipe.transform(pautaAprovada, 'nao');
    expect(resultado).toBe('45%');
  });
});
