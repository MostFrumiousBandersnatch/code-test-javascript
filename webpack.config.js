module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'bundle.js',
        path: './dist'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: "babel-loader",
                exclude: ['node_modules'],
                query: {
                    presets: ['es2015', 'stage-0', 'stage-3'],
                    plugins: [        
                        [
                            'transform-runtime', {
                                helpers: false,
                                polyfill: false,
                                regenerator: true
                            }
                        ],
                        'transform-async-to-generator'
                    ]
                }
            }
        ]
    }
}