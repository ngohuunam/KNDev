const CompressionPlugin = require('compression-webpack-plugin')
const { publicPath } = require('./package.json')

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? `/department/${pack.dept}/{{token}}/` : '/',
  // publicPath: `/department/${pack.dept}/{{token}}/`,
  publicPath: publicPath,
  outputDir: `../../backend/web/pages${publicPath}`,
  // assetsDir: pack.dept,
  // indexPath: pack.dept + '.html',
  productionSourceMap: true,
  filenameHashing: false,
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => Object.assign({}, options, { name: '[name].[ext]' }))
  },
  css: {
    sourceMap: false,
    extract: {
      filename: '[name].css',
      chunkFilename: '[name].css',
    },
  },
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 5000,
  },
  configureWebpack: {
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
      globalObject: 'this',
    },
    // module: {
    //   rules: [
    //     {
    //       test: /\.worker\.js$/,
    //       use: { loader: 'worker-loader' },
    //     },
    //   ],
    // },
    performance: {
      hints: false,
    },
    // optimization: {
    //   splitChunks: {
    //     minSize: 10000,
    //     maxSize: 250000,
    //   },
    // },
    plugins: [
      new CompressionPlugin({
        filename: '[path].gz[query]',
        // filename(info) {
        //   // info.file is the original asset filename
        //   // info.path is the path of the original asset
        //   // info.query is the query
        //   // console.log('info', info)
        //   if (info.path === 'index.html') info.path = pack.dept + '.html'
        //   return `${info.path}.gz${info.query}`
        // },
        algorithm: 'gzip',
        test: /\.vue$|\.js$|\.css$|\.html$|\.eot$|\.ttf$|\.woff$|\.woff2$|\.ico$/,
        cache: true,
        minRatio: 0.8,
        compressionOptions: { level: 9 },
      }),
    ],
  },
}
