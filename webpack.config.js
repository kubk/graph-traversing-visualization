const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: './dist/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    // https://github.com/wycats/handlebars.js/issues/953
    resolve: {
        alias: {
            'handlebars': 'handlebars/dist/handlebars.js'
        }
    }
};
