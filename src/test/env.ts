// eslint-disable-next-line import/no-import-module-exports
import sequelize from '../database/database';
import AccountService from '../services/Account.services';

async function global() {
  await sequelize.sync({ force: true });
  const control = await AccountService.findAll();
  if (control.length !== 0) {
    await AccountService.delete({}, true);
  }
}

export default global;
