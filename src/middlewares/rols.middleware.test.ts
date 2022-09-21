import request from 'supertest';
import app from '../app';

describe('test rols middleware', () => {
  test('get private url', async () => {
    const test = await request(app).get('/api/user/1').expect(401);

    expect(test.body).toMatchObject({ error: true, message: 'Token is undefinded' });
  });
});
