import { NextFunction, Request, Response } from 'express';
import routingMiddleware from './routing.middleware';

describe('Routing Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      params: {
        '0': 'api',
        pathname: 'api',
      },
      body: {},
    };
    mockResponse = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test('try import module', async () => {
    if (mockRequest.params) {
      mockRequest.params[0] = 'api/test';
      mockRequest.params.pathname = 'api/test.get';
      mockRequest.body = { id: 'stpmex' };
    }

    await routingMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.send).toBeCalledTimes(1);
  });

  test('route not found', async () => {
    const expectedResponse = {
      error: true,
      message: 'route not found',
    };

    if (mockRequest.params) {
      mockRequest.params[0] = 'api/test-routing';
      mockRequest.params.pathname = 'api/test-routing.get';
      mockRequest.body = { id: '' };
    }

    await routingMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toBeCalledTimes(1);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
});
