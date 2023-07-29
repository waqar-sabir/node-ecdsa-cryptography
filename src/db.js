/* eslint-disable no-console */
const Sequelize = require('sequelize');
const config = require('./config/config');

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  operatorsAliases: 0,
  pool: config.db.pool,
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require('./api/v1/modules/user/user.model')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
