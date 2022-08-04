import { Optional } from 'sequelize';
import { Table, Model, Column, DataType } from 'sequelize-typescript';
import IAccount from '../interfaces/IAccount';

type AccountCreationAttributes = Optional<IAccount, 'id'>;
@Table({
  timestamps: false,
  freezeTableName: false,
  modelName: 'accounts',
})
export default class Account extends Model<IAccount, AccountCreationAttributes> implements IAccount {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false })
  public id!: number;

  @Column({ type: DataType.STRING })
  public hash!: string;

  @Column({ type: DataType.STRING })
  public salt!: string;

  @Column({ type: DataType.STRING })
  public email?: string;

  @Column({ type: DataType.STRING })
  public emailGoogle?: string;

  @Column({ type: DataType.STRING, unique: true })
  public username!: string;
}
