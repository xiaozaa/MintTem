const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "/src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    umdNamedDefine: true,
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /node_modules\/@0x/,
        use: { loader: "umd-compat-loader" },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      favicon: "./src/images/logo.png",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new webpack.DefinePlugin({}),
  ],
  resolve: {
    fallback: {
      "https": false,
      os: require.resolve("os-browserify/browser"),
      "http": false,
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      "crypto": false,
    },
  },
};
