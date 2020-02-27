const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

module.exports = {
  entry: ['./src/scss/style.scss'],
  mode: 'production',
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, 'src/favicon/logo.svg'),
      inject: true,
      outputPath: './',
      prefix: '/',
      favicons: {
        appName: 'Portfolio',
        appDescription: 'Portfolio of Oliver Hepworth-Bell',
        background: '#121822',
        theme_color: '#fff',
        prefix: '/',
        start_url: '/',
        inject: true,
        cache: true,
        icons: {
          coast: false,
          yandex: false,
          firefox: false,
          appleStartup: false
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/html/index.html',
      excludeAssets: [/main.js/]
    }),
    new HtmlWebpackExcludeAssetsPlugin(),
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
