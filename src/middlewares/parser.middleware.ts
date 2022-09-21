import { Request, Response, NextFunction } from 'express';
import { getModuleByUrl } from '../libs/pathToTreeFile';
import ITreeFile from '../interfaces/ITreeFile';
import { ServerLog } from '../services/logger.services';
import { NoPathExistError, NoFileExistError } from '../classes/Error';
import { sendError } from '../core/trafic.core';

export default async function parser(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toLocaleLowerCase();
  const tree: ITreeFile = req.app.get('tree');

  try {
    const { params, pathname } = getModuleByUrl(`${req.params[0]}.${method}.js`, tree);
    req.params.pathname = pathname.replace(/\.\w+$/, '');
    req.body = { ...params, ...req.body };
    next();
  } catch (error: any) {
    if (error instanceof NoPathExistError) {
      sendError(res, 'resource not found');
      return;
    }
    if (error instanceof NoFileExistError) {
      sendError(res, 'resource not found');
      return;
    }
    ServerLog.warn(error.message);
    next();
  }
}
