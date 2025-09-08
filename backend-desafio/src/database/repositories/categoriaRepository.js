import { Categoria } from "../../models/Categoria.js";

export class CategoriaRepository {
  async criar(nome) {
    return await Categoria.create({ nome });
  }

  async listar() {
    return await Categoria.findAll({
      order: [["nome", "ASC"]],
    });
  }

  async buscarPorNome(nome) {
    return await Categoria.findOne({
      where: { nome },
    });
  }
}
