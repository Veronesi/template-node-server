import express, { NextFunction, Request, Response } from 'express';
import { pathToTreeFile } from '../libs/pathToTreeFile';
import rolsMiddleware from './rols.middleware';

describe('Rols Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    const tree = pathToTreeFile('../modules');

    mockRequest = {
      params: {
        '0': '',
        pathname: '',
      },
      body: {},
      app: express(),
      method: 'GET',
    };

    mockRequest.app?.set('tree', tree);

    mockResponse = {
      locals: {},
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test('get public route', async () => {
    if (mockRequest.params) {
      mockRequest.params[0] = 'api/auth/login';
      mockRequest.params.pathname = 'api/auth/login.post';
    }

    if (mockResponse.locals) {
      mockResponse.locals.account = 'test';
    }

    await rolsMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
  });

  test('get private route without login', async () => {
    if (mockRequest.params) {
      mockRequest.params[0] = 'logger/all';
      mockRequest.params.pathname = 'api/all.get';
    }

    const expectedResponse = { error: true, code: 401, message: 'user is not login' };

    await rolsMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.send).toBeCalledWith(expectedResponse);
  });

  test('get private route with login', async () => {
    if (mockRequest.params) {
      mockRequest.params[0] = 'api/user/1';
      mockRequest.params.pathname = 'api/user/[id].get';
    }

    if (mockResponse.locals) {
      mockResponse.locals.account = 'test';
      mockResponse.locals.userType = 'ADMIN`';
    }

    const expectedResponse = { error: true, code: 401, message: "Don't have permissions" };

    await rolsMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.send).toBeCalledWith(expectedResponse);
  });
});
