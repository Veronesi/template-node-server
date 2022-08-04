import request from 'supertest';
import Account from '../../services/Account.services';
import { verifyPassword } from '../../services/crypto.services';
import sequelize from '../../database/database';

import app from '../../app';

beforeAll(async () => {
  await sequelize.sync();
  const control = await Account.findAll();
  if (control && control.length !== 0) {
    await Account.delete({}, true);
  }
});
const api = request(app);
const account = {
  accountName: 'nekane',
  email: 'nekane@nekane.com',
  password: 'nekaneSweet',
};
const res = api.post('/api/account/register');
res.send({ account });

describe('User registration', () => {
  it('returns 200 OK when signup request is valid', (done) => {
    res.then((response) => {
      expect(response.status).toBe(200);
      done();
    });
  });

  it('returns success err when signup request is valid', (done) => {
    res.then((response) => {
      expect(response.body.error).toBe(false);
      done();
    });
  });
  it('save users to database', (done) => {
    res.then(async () => {
      const queryAccount = await Account.findAll({
        email: 'nekane@nekane.com',
      });
      expect(queryAccount.length).toBe(1);
      done();
    });
  });
  it('save accountname and email to database', (done) => {
    res.then(async () => {
      const queryAccount = await Account.findAll({
        email: 'nekane@nekane.com',
      });
      const newAccount = queryAccount[0];
      expect(newAccount).not.toBe(undefined);
      expect(newAccount.username).toBe('nekane');
      expect(newAccount.email).toBe('nekane@nekane.com');
      done();
    });
  });
  it('hashes the password in database', (done) => {
    res.then(async () => {
      const queryAccount = await Account.findAll({
        email: 'nekane@nekane.com',
      });
      const newAccount = queryAccount[0];
      const newHash = await verifyPassword('nekaneSweet', newAccount.salt);
      expect(newAccount.hash).not.toBe('nekaneSweet');
      expect(newAccount.hash).toBe(newHash);
      done();
    });
  });
});
afterAll(async () => {
  await sequelize.close();
});
