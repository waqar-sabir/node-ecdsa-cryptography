/* eslint-disable no-console */
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;

const db = require('./db');

db.sequelize
  .sync({ alter: true })
  .then(() => {
    logger.info('Connected to DB');
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);

    });
  })
  .catch((err) => {
    console.log(`Failed to sync db: ${err.message}`);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
