import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';

export const Pauta = sequelize.define('Pauta', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tempo_aberta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'pautas',
  timestamps: false, // já temos created_at/updated_at manuais
  indexes: [
    {
      unique: true,
      fields: ['nome']
    }
  ]
});
