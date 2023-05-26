let path = require("path");

module.exports = {
  entry: "./app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    // NOTE: tell webpack to resolve when there's no .js file
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: "./dist",
  },
  mode: "development",
};
