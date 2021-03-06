const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
// const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  outputDir: `../../backend/web/pages/login`,
  productionSourceMap: false,
  filenameHashing: false,
  css: { sourceMap: false, extract: false },
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 5001,
  },
  configureWebpack: {
    performance: {
      hints: false,
    },
    optimization: {
      splitChunks: false, // makes there only be 1 js file - leftover from earlier attempts but doesn't hurt
    },
    plugins: [
      // new TerserPlugin({
      //   terserOptions: {
      //     compress: {
      //       pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      //     },
      //   },
      // }),
      new HtmlWebpackPlugin({
        // filename: 'login.html',
        title: new Date().toLocaleString('vi'),
        template: 'public/template.html', // this is important - a template file to use for insertion
        inlineSource: '.(js|css)$', // embed all javascript and css inline
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.vue$|\.js$|\.css$|\.html$|\.eot$|\.ttf$|\.woff$|\.woff2$|\.ico$/,
        cache: true,
        minRatio: 0.8,
        threshold: 10240,
        deleteOriginalAssets: false,
      }),
      new CompressionPlugin({
        filename: '[path].br[query]',
        algorithm: 'brotliCompress',
        test: /\.vue$|\.js$|\.css$|\.html$|\.eot$|\.ttf$|\.woff$|\.woff2$|\.ico$/,
        cache: true,
        minRatio: 0.8,
        compressionOptions: { level: 11 },
        threshold: 10240,
        deleteOriginalAssets: false,
      }),
    ],
    // output: {
    //   globalObject: 'this',
    // },
  },
}
