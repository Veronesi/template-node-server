import express, { json, urlencoded } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

import { pathToTreeFile } from './libs/pathToTreeFile';

import routingMiddleware from './middlewares/routing.middlewares';
import authentication from './middlewares/authentication.middlewares';

dotenv.config({ path: path?.join?.(__dirname, '../configs/.env') });

const app: express.Application = express();

try {
  const tree = pathToTreeFile('../modules');
  app.set('tree', tree);
} catch (error: any) {
  // eslint-disable-next-line no-console
  console.log(`Erorr in create path tree in ${error.message}`);
  process.exit();
}

app.use(express.json());
app.use(urlencoded({ limit: '150mb', extended: true }));
app.use(json({ limit: '150mb' }));
app.use(cors({ origin: '*' }));

app.route('/*').all(authentication, routingMiddleware);

export default app;
