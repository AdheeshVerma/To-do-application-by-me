import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 50],
    },
  },
}, {
  tableName: 'tags',
  timestamps: true,
});

export const associate = (models) => {
  if (models.TodoItem) {
    Tag.belongsToMany(models.TodoItem, {
      through: 'TodoTag',
      foreignKey: 'tagId',
      otherKey: 'todoItemId',
    });
  }
};

export default Tag;
