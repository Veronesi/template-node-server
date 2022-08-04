import { createLogger, format, transports } from 'winston';

const logConfigurationServer = {
  transports: [new transports.Console({ level: 'warn' }), new transports.File({ filename: 'logs/error.log', level: 'warn' })],
  format: format.combine(
    format.label({ label: 'Server' }),
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.printf((info) => `{level: "${info.level}", label: "${info.label}", timestamp: "${[info.timestamp]}", message: "${info.message}"}`)
  ),
};

const logConfiguration = {
  transports: [new transports.Console({ level: 'info' }), new transports.File({ filename: 'logs/info.log', level: 'info' })],
  format: format.combine(
    format.label({ label: 'Server' }),
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.printf((info) => `{level: "${info.level}", label: "${info.label}", timestamp: "${[info.timestamp]}", message: "${info.message}"}`)
  ),
};

const logger = createLogger(logConfiguration);
export const ServerLog = createLogger(logConfigurationServer);
export default logger;
