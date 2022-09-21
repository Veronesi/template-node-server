import * as dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import { pathToTreeFile } from './libs/pathToTreeFile';
import { ServerLog } from './services/logger.services';

import routingMiddleware from './middlewares/routing.middlewares';
import authentication from './middlewares/authentication.middlewares';
import rolsMiddleware from './middlewares/rols.middlewares';
import parserMiddleware from './middlewares/parser.middleware';

dotenv.config({ path: path?.join?.(__dirname, '../configs/.env') });

const app: express.Application = express();

try {
  const tree = pathToTreeFile('../modules');
  app.set('tree', tree);
} catch (error: any) {
  ServerLog.error(`can't create path tree in ${error.message}`);
  process.exit();
}

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static(path.join?.(__dirname, '../public')));
app.use(urlencoded({ limit: '150mb', extended: true }));
app.use(json({ limit: '150mb' }));
app.use(cors({ origin: '*' }));
app.route('/*').all(parserMiddleware, authentication, rolsMiddleware, routingMiddleware);

export default app;
