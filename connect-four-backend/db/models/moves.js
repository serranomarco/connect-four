'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Moves extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Moves.belongsTo(models.Games, { foreignKey: 'gameId', onDelete: 'cascade' });
      Moves.belongsTo(models.Players, { foreignKey: 'playerId' });
    }
  }
  Moves.init({
    column: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Moves',
  });
  return Moves;
};