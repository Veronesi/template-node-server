import jwt, { Secret } from 'jsonwebtoken';
import { TokenDecoded } from '../interfaces/IJwt';

export function createToken(account: string) {
  if (!process.env.SEED) {
    return false;
  }
  const secretKey: Secret = process.env.SEED;
  const { EXPIRATION_TOKEN: expiresIn } = process.env;

  return jwt.sign({ account }, secretKey, { expiresIn });
}

export function verifyToken(token: string = ''): TokenDecoded {
  const secretKey = process.env.SEED;

  if (!secretKey) {
    return {
      decoded: null,
      error: true,
      message: 'SEED is undefined',
    };
  }
  if (!token) {
    return {
      decoded: null,
      error: true,
      message: 'Token is undefinded',
    };
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    return {
      decoded,
      error: false,
      message: 'Ok',
    };
  } catch (err) {
    return {
      decoded: null,
      error: true,
      message: 'Token is not valid',
    };
  }
}
