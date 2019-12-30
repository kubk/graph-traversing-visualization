module.exports = {
  entry: './src/index.ts',
  output: {
    filename: './bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: 'ts-loader'
      }
    ]
  },
  // https://github.com/wycats/handlebars.js/issues/953
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      handlebars: 'handlebars/dist/handlebars.js'
    }
  }
};
