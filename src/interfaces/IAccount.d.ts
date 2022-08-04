export default interface IAccount {
  id: number;
  email?: string;
  hash: string;
  emailGoogle?: string;
  salt: string;
  username: string;
  role: string;
}
