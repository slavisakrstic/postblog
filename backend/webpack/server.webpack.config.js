/*eslint-disable @typescript-eslint/no-var-requires*/
const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");
const dotenv = require("dotenv");
const nodeExternals = require("webpack-node-externals");
dotenv.config();

const nodeArgs = ["-r", "dotenv/config", "-r", "source-map-support/register"];
if (process.env.DEBUG_REMOTE === "true") {
  nodeArgs.push("--inspect=0.0.0.0:9229");
}

const server = (env) => {
  if (env && env.debug === "true") {
    nodeArgs.push(env.break ? "--inspect-brk" : "--inspect");
  }

  return {
    entry: path.resolve("./src/main.ts"),
    mode: process.env.NODE_ENV || "production",
    output: {
      path: path.resolve("./dist"),
      filename: "server.js",
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      new NodemonPlugin({
        nodeArgs,
        script: "dist/server.js",
        outDir: "dist",
      }),
    ],
    resolve: {
      extensions: [".ts", ".js", ".json"],
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
    },
    externals: [nodeExternals()],
    devtool: "source-map",
    target: "node",
  };
};

module.exports = [server];
