export class CategoriaController {
  constructor(categoriaService) {
    this.categoriaService = categoriaService;
  }

  criarCategoria = async (req, res) => {
    const { nome } = req.body;
    try {
      console.info("Criando categoria.")
      const categoria = await this.categoriaService.criarCategoria(nome);
      res.status(201).json(categoria);
    } catch (err) {
      if (err.message === 'CATEGORY_EXISTS') {
        return res.status(409).json({ error: 'Categoria já cadastrada' });
      }
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  };

  listarCategorias = async (req, res) => {
    try {
      console.info("Iniciando Listagem de categoria.")
      const categorias = await this.categoriaService.listarCategorias();
      res.json(categorias);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar categorias' });
    }
  };
}
