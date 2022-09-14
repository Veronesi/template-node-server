import { Request, Response, NextFunction } from 'express';
import Account from '../services/Account.services';
import ROUTES from '../configs/routes';
import ROLS from '../configs/rols';
import { getModuleByUrl } from '../libs/pathToTreeFile';
import ITreeFile from '../interfaces/ITreeFile';

function sendError(res: Response, message: string) {
  return res.status(501).json({
    error: true,
    message,
  });
}

export default async function rolsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (ROUTES.PUBLIC_ROUTES.has(req.params.pathname)) {
    return next();
  }
  const { account } = res.locals;
  if (!account) {
    return sendError(res, 'user is not login');
  }
  try {
    const { role = 'user', username = '' } = (await Account.findOne({ username: account }, ['role', 'username'])) ?? {};
    if (!username) {
      return sendError(res, 'username not found');
    }

    const roleUpperCase = role.toUpperCase();
    const roleSelect: string = Object.keys(ROLS).find((e) => e === roleUpperCase) ?? 'USER';
    const UrlList: string[] = ROLS[roleSelect];

    const tree: ITreeFile = req.app.get('tree');

    const url = getModuleByUrl(req.params[0], tree)
      .pathname.replace(/\.(\w+).(js|ts)$/, '')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]');
    const method = req.method.toLocaleLowerCase();

    const havePermissions = UrlList.find((e) => {
      const re: RegExp = new RegExp(`${url}.(${method}|all)`);
      return re.exec(e);
    });

    return havePermissions ? next() : sendError(res, "Don't have permissions");
  } catch (err) {
    return res.status(500).json({
      err,
      message: 'error in the trycatch rols middleware',
    });
  }
}
