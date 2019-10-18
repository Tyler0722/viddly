const merge = require("webpack-merge");
const path = require("path");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    historyApiFallback: true,
    host: "0.0.0.0",
    overlay: true,
    port: 3000,
    watchContentBase: true
  },
  devtool: "eval",
  mode: "development"
});
