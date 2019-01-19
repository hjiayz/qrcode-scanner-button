var webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + '/dist',
    filename: "index.js",
    library: "QrcodeScannerButton",
    libraryTarget: "umd"
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ]
};
