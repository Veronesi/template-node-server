import { Request, Response, NextFunction } from 'express';
import { HttpLog, ServerLog } from '../services/logger.service';

export default async function routing(req: Request, res: Response, next: NextFunction) {
  let moduleFunction = await import('../modules/api/501');
  try {
    const { body, query } = req;
    if (req.params[0].startsWith('api/stpmex') && req.method !== 'GET') {
      await HttpLog(`[${req.method}] ${req.params[0]}`).http(JSON.stringify({ body, query }));
    }
    moduleFunction = await import(`../modules/${req.params.pathname}`);
  } catch (error: any) {
    if (!error.message.includes('test')) {
      ServerLog.error(error.message);
    }
    moduleFunction = await import('../modules/api/501');
  } finally {
    moduleFunction.default(req, res, next);
  }
}
