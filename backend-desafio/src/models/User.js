import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
  },
  tipo: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false, // não precisamos de created_at/updated_at
  indexes: [
    {
      unique: true,
      fields: ['cpf']
    }
  ]
});
