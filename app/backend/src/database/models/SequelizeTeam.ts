import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '.';

class SequelizeTeam extends Model<InferAttributes<SequelizeTeam>, InferCreationAttributes<SequelizeTeam>> {
  declare id: CreationOptional<number>;
  declare teamName: string;
}

SequelizeTeam.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize: db,
  tableName: 'teams',
  modelName: 'team',
  underscored: true,
  timestamps: false,
})

export default SequelizeTeam;