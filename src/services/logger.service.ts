import { createLogger, format, transports } from 'winston';
import path from 'path';

const logConfigurationServer = {
  transports: [
    new transports.Console({ level: 'warn' }),
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'warn' }),
  ],
  format: format.combine(
    format.label({ label: 'Server' }),
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.printf(
      (info) => `{level: "${info.level}", label: "${info.label}", timestamp: "${[info.timestamp]}", message: "${info.message.replace(/"/, "'")}"}`
    )
  ),
};

const logConfiguration = {
  transports: [new transports.Console({ level: 'info' }), new transports.File({ filename: '../logs/info.log', level: 'info' })],
  format: format.combine(
    format.label({ label: 'Server' }),
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.printf(
      (info) => `{level: "${info.level}", label: "${info.label}", timestamp: "${[info.timestamp]}", message: "${info.message.replace(/"/, "'")}"}`
    )
  ),
};

const logConfigurationAccount = {
  transports: [new transports.File({ filename: './logs/account.log', level: 'info' })],
  format: format.combine(
    format.label({ label: 'Account' }),
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.printf(
      (info) => `{level: "${info.level}", label: "${info.label}", timestamp: "${[info.timestamp]}", message: "${info.message.replace(/"/, "'")}"}`
    )
  ),
};

const logConfigurationStpmex = (label: string) => {
  return createLogger({
    transports: [
      new transports.Console({ level: 'warn' }),
      new transports.File({ filename: path.join(__dirname, '../logs/stpmex.log'), level: 'http' }),
    ],
    format: format.combine(
      format.label({ label }),
      format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      format.printf(
        (info) => `{level: "${info.level}", label: "${info.label}", timestamp: "${[info.timestamp]}", message: "${info.message.replace(/"/g, "'")}"}`
      )
    ),
  });
};

const logConfigurationHttp = (label: string) => {
  return createLogger({
    transports: [
      new transports.Console({ level: 'warn' }),
      new transports.File({ filename: path.join(__dirname, '../logs/http.log'), level: 'http' }),
    ],
    format: format.combine(
      format.label({ label }),
      format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      format.printf(
        (info) => `{level: "${info.level}", label: "${info.label}", timestamp: "${[info.timestamp]}", message: "${info.message.replace(/"/g, "'")}"}`
      )
    ),
  });
};

const logger = createLogger(logConfiguration);
export const ServerLog = createLogger(logConfigurationServer);
export const AccountLog = createLogger(logConfigurationAccount);
export const StpmexLog = logConfigurationStpmex;
export const HttpLog = logConfigurationHttp;
export default logger;
