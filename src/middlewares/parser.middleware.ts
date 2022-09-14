import { Request, Response, NextFunction } from 'express';
import { getModuleByUrl } from '../libs/pathToTreeFile';
import ITreeFile from '../interfaces/ITreeFile';
import { ServerLog } from '../services/logger.services';
import { NoPathExistError, NoFileExistError } from '../classes/Error';

export default async function parser(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toLocaleLowerCase();
  const tree: ITreeFile = req.app.get('tree');

  try {
    const { params, pathname } = getModuleByUrl(`${req.params[0]}.${method}.js`, tree);
    req.params['pathname'] = pathname.replace(/\.\w+$/, '');
    req.body = { ...params, ...req.body };
    next();
  } catch (error: any) {
    if(error instanceof NoPathExistError){
      return res.send({
        success: false,
        message: 'resource not found'
      })
    }
    if(error instanceof NoFileExistError){
      return res.send({
        success: false,
        message: 'resource not found'
      })
    }
    ServerLog.warn(error.message);
    next();
  }
}
