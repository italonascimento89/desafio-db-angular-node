import { PautaController } from '../../../src/controllers/pautaController.js';

describe('PautaController', () => {
  let pautaServiceMock;
  let userServiceMock;
  let pautaController;
  let req;
  let res;

  beforeEach(() => {
    pautaServiceMock = {
      createPauta: jest.fn(),
      listPautas: jest.fn(),
      getPautaById: jest.fn(),
    };

    userServiceMock = {
      isUserAdmin: jest.fn(),
    };

    pautaController = new PautaController(pautaServiceMock, userServiceMock);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('createPauta', () => {
    it('deve criar uma pauta com sucesso', async () => {
      req.body = {
        nome: 'Nova Pauta',
        descricao: 'Descrição da pauta',
        tempo_aberta: 2,
        id_admin: 'uuid-admin',
        categoria: 'Financeiro',
      };

      userServiceMock.isUserAdmin.mockResolvedValue(true);
      pautaServiceMock.createPauta.mockResolvedValue({
        id: 'uuid-pauta',
        ...req.body,
      });

      await pautaController.createPauta(req, res);

      expect(userServiceMock.isUserAdmin).toHaveBeenCalledWith('uuid-admin');
      expect(pautaServiceMock.createPauta).toHaveBeenCalledWith(
        'Nova Pauta',
        'Descrição da pauta',
        2,
        'Financeiro'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 'uuid-pauta',
        ...req.body,
      });
    });

    it('deve usar tempo_aberta default 1 se não informado', async () => {
      req.body = {
        nome: 'Nova Pauta',
        descricao: 'Descrição',
        id_admin: 'uuid-admin',
        categoria: 'Financeiro',
      };

      userServiceMock.isUserAdmin.mockResolvedValue(true);
      pautaServiceMock.createPauta.mockResolvedValue({
        id: 'uuid-pauta',
        ...req.body,
        tempo_aberta: 1,
      });

      await pautaController.createPauta(req, res);

      expect(pautaServiceMock.createPauta).toHaveBeenCalledWith(
        'Nova Pauta',
        'Descrição',
        1,
        'Financeiro'
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('deve retornar 400 se usuário não for admin', async () => {
      req.body = { nome: 'Pauta', id_admin: 'uuid-user', categoria: 'Financeiro' };
      userServiceMock.isUserAdmin.mockRejectedValue(new Error('FORBIDDEN'));

      await pautaController.createPauta(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Permissão negada, só administrador pode criar pauta.',
      });
    });

    it('deve retornar 409 se pauta já existe', async () => {
      req.body = { nome: 'Pauta', id_admin: 'uuid-admin', categoria: 'Financeiro' };
      userServiceMock.isUserAdmin.mockResolvedValue(true);
      pautaServiceMock.createPauta.mockRejectedValue(new Error('PAUTA_EXISTS'));

      await pautaController.createPauta(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Já existe uma pauta com este nome.',
      });
    });

    it('deve retornar 500 em caso de erro inesperado', async () => {
      req.body = { nome: 'Pauta', id_admin: 'uuid-admin', categoria: 'Financeiro' };
      userServiceMock.isUserAdmin.mockResolvedValue(true);
      pautaServiceMock.createPauta.mockRejectedValue(new Error('Erro desconhecido'));

      await pautaController.createPauta(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar pauta' });
    });
  });

  describe('listPautas', () => {
    it('deve listar pautas com sucesso', async () => {
      req.query = { page: '2', limit: '5', categoria: 'Financeiro' };
      pautaServiceMock.listPautas.mockResolvedValue({ pautas: [], total: 0 });

      await pautaController.listPautas(req, res);

      expect(pautaServiceMock.listPautas).toHaveBeenCalledWith(2, 5, null, 'Financeiro');
      expect(res.json).toHaveBeenCalledWith({ pautas: [], total: 0 });
    });

    it('deve retornar 500 em caso de erro', async () => {
      pautaServiceMock.listPautas.mockRejectedValue(new Error('Erro desconhecido'));

      await pautaController.listPautas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao listar pautas' });
    });
  });

  describe('getPautaById', () => {
    it('deve retornar uma pauta por ID com sucesso', async () => {
      req.params = { id: 'uuid-pauta' };
      const pautaMock = { id: 'uuid-pauta', nome: 'Pauta 1' };
      pautaServiceMock.getPautaById.mockResolvedValue(pautaMock);

      await pautaController.getPautaById(req, res);

      expect(pautaServiceMock.getPautaById).toHaveBeenCalledWith('uuid-pauta');
      expect(res.json).toHaveBeenCalledWith(pautaMock);
    });

    it('deve retornar 404 se pauta não encontrada', async () => {
      req.params = { id: 'uuid-invalida' };
      pautaServiceMock.getPautaById.mockRejectedValue(new Error('NOT_FOUND'));

      await pautaController.getPautaById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Pauta não encontrada' });
    });

    it('deve retornar 500 em caso de erro inesperado', async () => {
      req.params = { id: 'uuid-invalida' };
      pautaServiceMock.getPautaById.mockRejectedValue(new Error('Erro desconhecido'));

      await pautaController.getPautaById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar pauta' });
    });
  });
});
