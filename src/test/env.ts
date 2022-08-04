import sequelize from '../database/database';
import Account from '../services/Account.services';

async function global() {
  await sequelize.sync({ force: true });
  const control = await Account.findAll();
  if (control && control.length !== 0) {
    await Account.delete({}, true);
  }
}

export default global;
