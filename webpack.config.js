const path = require('path');
const webpack = require('webpack');

module.exports = (env, { mode }) => {
  return {
    entry: './src/index.ts',
    output: {
      filename: './bundle.js',
      path: path.join(__dirname, 'public')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          use: 'ts-loader'
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    // https://github.com/wycats/handlebars.js/issues/953
    resolve: {
      extensions: ['.js', '.ts'],
      alias: {
        handlebars: 'handlebars/dist/handlebars.js'
      }
    },
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      compress: true,
      port: 9000
    },
    devtool: mode === 'production' ? undefined : 'source-map',
    plugins: mode === 'production' ? [] : [new webpack.SourceMapDevToolPlugin({})]
  };
};
