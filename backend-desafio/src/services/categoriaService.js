export class CategoriaService {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async criarCategoria(nome) {
    const existente = await this.categoriaRepository.buscarPorNome(nome);
    if (existente) {
      throw new Error('CATEGORY_EXISTS');
    }

    return await this.categoriaRepository.criar(nome);
  }

  async listarCategorias() {
    return await this.categoriaRepository.listar();
  }
}
