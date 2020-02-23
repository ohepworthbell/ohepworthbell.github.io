const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./src/scss/style.scss'],
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Portfolio',
      template: 'src/html/index.html',
      inject: false
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new CopyPlugin([
      {
        from: 'src/images/',
        to: 'img/'
      },
      {
        from: 'src/video/',
        to: 'video/'
      },
      {
        from: 'src/projects/',
        to: './'
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.s?[ac]?ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, './build/')
  },
  devServer: {
    contentBase: path.join(__dirname, './build/'),
    compress: true,
    port: 9000,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: false,
      warnings: true,
      publicPath: true
    }
  },
  watch: false
};
