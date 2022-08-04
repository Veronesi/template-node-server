import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';

const baseRoute = path.join(__dirname, '..');
const baseRouteENV = path.join(__dirname, '..', '..');

dotenv.config({ path: `${baseRouteENV}/config/.env` });
if (!process.env.DB_PORT) {
  process.env.DB_PORT = '-1';
}
let sequelize: Sequelize;
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    database: 'test',
    storage: ':memory:',
    models: [`${baseRoute}/models`],
  });
} else {
  let dialect: Dialect = 'mysql';
  try {
    dialect = process.env.DB_DIALECT as Dialect;

    sequelize = new Sequelize({
      database: process.env.DB_NAME,
      dialect,
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
      storage: ':memory:',
      models: [`${baseRoute}/models`],
    });
  } catch (error: any) {
    process.exit();
  }
}
export = sequelize;
