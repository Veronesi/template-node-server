import { Request, Response, NextFunction } from 'express';

export default interface ModuleFunction {
  // requiredRoles: string[];
  // eslint-disable-next-line no-unused-vars
  default: (req: Request, res: Response, next?: NextFunction) => any;
}
