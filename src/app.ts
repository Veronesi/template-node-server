import express from 'express';
import { pathToTreeFile } from './libs/pathToTreeFile';
import routingMiddleware from './middlewares/routing.middleware';

const app: express.Application = express();

try {
  const tree = pathToTreeFile('../modules');
  app.set('tree', tree);
} catch (error: any) {
  console.log(`Erorr in create path tree in ${error.message}`);
  process.exit();
}

app.route('/api/*')
  .get(routingMiddleware)

export default app;