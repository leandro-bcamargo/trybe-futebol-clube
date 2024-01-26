import { CreationOptional, DataTypes, InferAttributes,
  InferCreationAttributes, Model } from 'sequelize';
import db from '.';

class SequelizeTeamModel extends
  Model<InferAttributes<SequelizeTeamModel>,
  InferCreationAttributes<SequelizeTeamModel>> {
  declare id: CreationOptional<number>;
  declare teamName: string;
}

SequelizeTeamModel.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'team_name',
  },
}, {
  sequelize: db,
  tableName: 'teams',
  modelName: 'team',
  underscored: true,
  timestamps: false,
});

export default SequelizeTeamModel;
