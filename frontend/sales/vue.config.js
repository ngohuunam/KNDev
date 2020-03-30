const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const { publicPath } = require('./package.json')

module.exports = {
  publicPath: publicPath,
  outputDir: `../../backend/web/pages${publicPath}`,
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
    performance: {
      hints: false,
    },
    plugins: [
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.vue$|\.js$|\.css$$|\.html$|\.eot$|\.ttf$|\.woff$|\.woff2$|\.ico$/,
        cache: true,
        minRatio: 0.8,
        compressionOptions: { level: 9 },
      }),
      new HtmlWebpackPlugin({
        filename: 'index_.html',
        template: 'public/template.html', // this is important - a template file to use for insertion
        inlineSource: '.(js|css)$', // embed all javascript and css inline
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
    ],
  },
}
