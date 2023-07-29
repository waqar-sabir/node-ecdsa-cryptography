const { version } = require('../../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Teddies API documentation',
    version,
  },
  servers: [
    {
      url: `http://localhost:4000/api/v1/`,
    },
  ],
};

module.exports = swaggerDef;
