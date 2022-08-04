import app from './app';
import logger from './services/logger.services';

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  logger.info(`server on port ${process.env.PORT}`);
});
