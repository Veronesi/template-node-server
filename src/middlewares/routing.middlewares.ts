import { Request, Response, NextFunction } from 'express';
import { getModuleByUrl } from '../libs/pathToTreeFile';
import ITreeFile from '../interfaces/ITreeFile';

export default async function routing(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toLocaleLowerCase();
  const tree: ITreeFile = req.app.get('tree');

  let moduleFunction = await import('../modules/api/501');
  try {
    const { params, pathname } = getModuleByUrl(`${req.params[0]}.${method}.js`, tree);
    req.body = { ...params, ...req.body };

    moduleFunction = await import(`../modules/${pathname}`);
  } catch (error) {
    moduleFunction = await import('../modules/api/501');
  } finally {
    moduleFunction.default(req, res, next);
  }
}
