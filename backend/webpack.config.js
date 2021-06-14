/* eslint-disable @typescript-eslint/no-var-requires */
const server = require("./webpack/server.webpack.config");
const migrations = require("./webpack/migrations.webpack.config");

module.exports = [...server, ...migrations];
