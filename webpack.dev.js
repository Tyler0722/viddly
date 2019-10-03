const merge = require("webpack-merge");
const fs = require("fs");
const path = require("path");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "eval",
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    historyApiFallback: true,
    host: "0.0.0.0",
    overlay: true,
    port: 3000,
    watchContentBase: true
  },
  mode: "development"
});
