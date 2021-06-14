/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const dotenv = require("dotenv");
const nodeExternals = require("webpack-node-externals");
const glob = require("glob");
dotenv.config();

const migrationsScripts = {
  entry: glob.sync(path.resolve("./src/migrations/*.ts")).reduce((entries, filename) => {
    const migrationName = path.basename(filename, ".ts");
    return Object.assign({}, entries, {
      [migrationName]: filename,
    });
  }, {}),
  mode: process.env.NODE_ENV || "production",
  resolve: {
    extensions: [".ts"],
  },
  output: {
    path: path.resolve("./dist/migrations"),
    libraryTarget: "umd",
    filename: "[name].js",
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
  optimization: {
    minimize: false,
  },
  externals: [nodeExternals()],
  target: "node",
};

const migrate = {
  entry: path.resolve("./src/migrate.ts"),
  mode: process.env.NODE_ENV || "production",
  output: {
    path: path.resolve("./dist"),
    filename: "migrate.js",
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
  externals: [nodeExternals()],
  devtool: "source-map",
  target: "node",
};

module.exports = [migrate, migrationsScripts];
