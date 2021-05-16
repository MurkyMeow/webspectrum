const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './web/index.ts',
  mode: PRODUCTION ? 'production' : 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'static')],
    contentBasePublicPath: ['/', '/static'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'web/index.html'),
          to: path.join(__dirname, 'dist'),
        },
      ],
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
