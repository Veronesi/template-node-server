import { Request, Response, NextFunction } from 'express';
import Account from '../services/Account.services';
import ROUTES from '../configs/routes';
import ROLS from '../configs/rols';
import { getModuleByUrl } from '../libs/pathToTreeFile';
import ITreeFile from '../interfaces/ITreeFile';
import { sendError } from '../core/trafic.core';

export default async function rolsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (ROUTES.PUBLIC_ROUTES.has(req.params.pathname)) {
    next();
    return;
  }
  const { account } = res.locals;
  if (!account) {
    sendError(res, 'user is not login', 401);
    return;
  }
  try {
    const { role = 'user', username = '' } = (await Account.findOne({ username: account }, ['role', 'username'])) ?? {};
    if (!username) {
      sendError(res, 'username not found', 401);
      return;
    }

    const roleUpperCase = role.toUpperCase();
    const roleSelect: string = Object.keys(ROLS).find((e) => e === roleUpperCase) ?? 'USER';
    const UrlList: string[] = ROLS[roleSelect];

    const tree: ITreeFile = req.app.get('tree');
    const url = getModuleByUrl(`${req.params[0]}.${req.method.toLocaleLowerCase()}.js`, tree)
      .pathname.replace(/\.(\w+).(js|ts)$/, '')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]');
    const method = req.method.toLocaleLowerCase();

    const havePermissions = UrlList.find((e) => {
      const re: RegExp = new RegExp(`${url}.(${method}|all)`);
      return re.exec(e);
    });

    if (havePermissions) {
      next();
      return;
    }
    sendError(res, "Don't have permissions", 401);
    return;
  } catch (err) {
    sendError(res, 'error in the trycatch rols middleware');
  }
}
