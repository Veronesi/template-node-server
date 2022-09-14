import { Request, Response, NextFunction } from 'express';
import { getModuleByUrl } from '../libs/pathToTreeFile';
import ITreeFile from '../interfaces/ITreeFile';
import { ServerLog } from '../services/logger.services';

export default async function routing(req: Request, res: Response, next: NextFunction) {
  let moduleFunction = await import('../modules/api/501');
  try {
    moduleFunction = await import(`../modules/${req.params.pathname}`);
  } catch (error: any) {
    ServerLog.warn(error.message);
    moduleFunction = await import('../modules/api/501');
  } finally {
    moduleFunction.default(req, res, next);
  }
}
