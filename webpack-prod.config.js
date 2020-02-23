const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./src/scss/style.scss'],
  mode: 'production',
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/html/index.html',
      inject: false
    }),
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
  watch: false
};
