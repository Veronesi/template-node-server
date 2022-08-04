import AccountsModel from '../models/Account.models';
import SequelizeBaseRepository from '../core/repository.core';
import sequelize from '../database/database';

class AccountService extends SequelizeBaseRepository<AccountsModel> {
  /* constructor(Model:ModelCtor<Accounts>) {
    super(Model);
  } */
}

sequelize.addModels([AccountsModel]);
const Account = new AccountService(AccountsModel);

export default Account;
