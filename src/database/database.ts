import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import { ServerLog } from '../services/logger.services';

const baseRoute = path.join(__dirname, '..');
const baseRouteENV = path.join(__dirname, '..', '..');

dotenv.config({ path: `${baseRouteENV}/configs/.env` });
if (!process.env.DB_PORT) {
  process.env.DB_PORT = '-1';
}
let sequelize: Sequelize;
try {
  let dialect: Dialect = 'mysql';
  dialect = process.env.DB_DIALECT as Dialect;

  if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize({
      dialect,
      database: 'test',
      storage: ':memory:',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      models: [`${baseRoute}/models`],
      logging: false,
    });
  } else {
    sequelize = new Sequelize({
      database: process.env.DB_NAME,
      dialect,
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
      storage: ':memory:',
      models: [`${baseRoute}/models`],
      logging: false,
    });

    sequelize.authenticate().catch((error: Error) => {
      ServerLog.error(error.message);
      process.exit();
    });
  }
} catch (error: any) {
  ServerLog.error(error.message);
  process.exit();
}
export = sequelize;
