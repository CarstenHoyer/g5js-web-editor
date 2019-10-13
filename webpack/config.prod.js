const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');
const cssnano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin')

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

module.exports = [
  {
    devtool: 'source-map',
    mode: 'production',
    entry: {
      app: [
        '@babel/polyfill',
        'core-js/modules/es6.promise',
        'core-js/modules/es6.array.iterator',
        path.resolve(__dirname, '../client/index.jsx')
      ]
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].[hash].js',
      publicPath: '/'
    },

    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['client', 'node_modules']
    },
    module: {
      rules: [
        {
          test: /main\.scss$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  postcssFocus(),
                  cssnext({
                    browsers: ['last 2 versions', 'IE > 9']
                  }),
                  cssnano({
                    autoprefixer: false
                  }),
                  postcssReporter({
                    clearMessages: true
                  })
                ],
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.(svg|mp3)$/,
          use: 'file-loader'
        },
        {
          test: /\.(png)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        },
        {
          test: /fonts\/.*\.(eot|svg|ttf|woff|woff2)$/,
          use: 'file-loader'
        },
        {
          test: /_console-feed.scss/,
          use: {
            loader: 'sass-extract-loader',
            options: {
              plugins: [
                {
                  plugin: 'sass-extract-js',
                  options: {
                    camelCase: false
                  }
                }
              ]
            }
          }
        }
      ]
    },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
      new ManifestPlugin({
        basePath: '/'
      }),
      new MiniCssExtractPlugin({
        filename: 'app.[hash].css'
      }),
      new CopyWebpackPlugin([{
        from: 'bundle.js',
        to: path.resolve(__dirname, '../dist'),
        filename: 'bundle.[hash].js',
        context: path.resolve(__dirname, '../node_modules/g5js/dist/')
      }, {
        from: 'optimized.wasm',
        to: path.resolve(__dirname, '../dist/wasm'),
        filename: 'optimized.[hash].wasm',
        context: path.resolve(__dirname, '../node_modules/g5js/dist/wasm')
      }]),
      new HtmlWebpackPlugin({
        hash: true,
        template: './index.html',
        filename: '../dist/index.[hash].html'
      })
    ]
  },
  {
    entry: {
      app: [path.resolve(__dirname, '../client/utils/previewEntry.js')]
    },
    target: 'web',
    mode: 'production',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'previewScripts.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      modules: ['client', 'node_modules']
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      ]
    }
  }
];
