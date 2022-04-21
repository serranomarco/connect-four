'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Games.belongsTo(models.Players, { foreignKey: 'playerOneId'});
      Games.belongsTo(models.Players, { foreignKey: 'playerTwoId'});
      Games.hasMany(models.Moves, { foreignKey: 'gameId', onDelete: 'cascade' });
    }
  }
  Games.init({
    playerOneId: DataTypes.INTEGER,
    playerTwoId: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Games',
  });
  return Games;
};