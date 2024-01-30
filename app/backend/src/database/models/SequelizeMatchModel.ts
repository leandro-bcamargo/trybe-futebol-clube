import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '.';
import SequelizeTeamModel from './SequelizeTeamModel';

class SequelizeMatchModel extends
  Model<InferAttributes<SequelizeMatchModel>, InferCreationAttributes<SequelizeMatchModel>> {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

SequelizeMatchModel.init({
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'home_team_id',
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'home_team_goals',
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'away_team_id',
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'away_team_goals',
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'in_progress',
  },
}, {
  sequelize: db,
  tableName: 'matches',
  modelName: 'match',
  underscored: true,
  timestamps: false,
});

SequelizeMatchModel.belongsTo(SequelizeTeamModel, {
  foreignKey: 'homeTeamId', as: 'homeTeam',
});
SequelizeMatchModel.belongsTo(SequelizeTeamModel, {
  foreignKey: 'awayTeamId', as: 'awayTeam',
});

SequelizeTeamModel.hasMany(SequelizeMatchModel, { foreignKey: 'homeTeamId', as: 'homeTeam' });
SequelizeTeamModel.hasMany(SequelizeMatchModel, { foreignKey: 'awayTeamId', as: 'awayTeam' });

export default SequelizeMatchModel;
