import { DataTypes } from "sequelize";
import { sequelize } from "../database/sequelize.js";

export const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "categorias",
    timestamps: false, // se não quiser createdAt/updatedAt
    indexes: [
      {
        unique: true,
        fields: ['nome']
      }
    ]
  }
);
