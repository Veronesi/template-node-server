import request from 'supertest';
import Account from '../../../services/Account.services';
import sequelize from '../../../database/database';
import { verifyPassword } from '../../../services/crypto.services';
import app from '../../../app';

const api = request(app);

const account = {
  username: 'nekane',
  email: 'nekane@nekane.com',
  password: 'nekaneSweet',
};

const res = api.post('/api/account/register');
res.send({ ...account });

beforeAll(async () => {
  await sequelize.sync();
  const control = await Account.findAll();
  if (control && control.length !== 0) {
    await Account.delete({}, true);
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe('User registration', () => {
  test('returns 200 OK when signup request is valid', (done) => {
    res.then((response) => {
      expect(response.status).toBe(200);
      done();
    });
  });

  test('returns success err when signup request is valid', (done) => {
    res.then((response) => {
      expect(response.error).toBe(false);
      done();
    });
  });
  test('save users to database', (done) => {
    res.then(async () => {
      const queryAccount = await Account.findAll({
        email: 'nekane@nekane.com',
      });
      expect(queryAccount.length).toBe(1);
      done();
    });
  });
  test('save accountname and email to database', (done) => {
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
  test('hashes the password in database', (done) => {
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
