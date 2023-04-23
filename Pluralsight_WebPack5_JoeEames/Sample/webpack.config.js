//webpack.config.js v7.0
const path = require("path"); //CommonJS modules

let production = process.env.NODE_ENV === "production";

let config = {
  entry: ["./src/index", "./src/home"], // NOTE: updates to no extension file name.
  output: {
    //where to output
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    // NOTE: tell webpack to resolve when there's no .js file
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    static: "./dist",
  },
};

if (production) {
  config.mode = "production";
  config.devtool = "inline-source-map";
}

module.exports = config;
