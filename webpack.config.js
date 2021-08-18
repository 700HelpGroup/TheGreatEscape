const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "main.[contenthash].js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/template.html" }),
    new ZipPlugin({ path: __dirname, filename: "build.zip" }),
  ],
};
