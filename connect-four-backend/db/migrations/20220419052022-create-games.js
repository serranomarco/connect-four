'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      playerOneId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Players' }
      },
      playerTwoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Players' }
      },
      state: {
        default: "IN_PROGRESS",
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Games');
  }
};