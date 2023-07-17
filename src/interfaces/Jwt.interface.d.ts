export interface UserToken {
  account?: number;
  userType?: string;
  accountName?: string;
  emailGoogle?: string;
  img?: string;
  google?: boolean;
}
export interface TokenDecoded {
  decoded: any;
  error: boolean;
  message: string;
}
