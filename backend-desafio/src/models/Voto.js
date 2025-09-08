import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';

export const Voto = sequelize.define('Voto', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false
  },
  pauta_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  voto: {
    type: DataTypes.ENUM('sim', 'nao'),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'votos',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['cpf', 'pauta_id']
    }
  ]
});
