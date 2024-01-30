module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('matches', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      home_team_id: {
        type: Sequelize.INTEGER,
        allow_null: false,
        references: {
          model: 'teams',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      },
      home_team_goals: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      away_team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
      },
      away_team_goals: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      in_progress: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('matches');
  }
}