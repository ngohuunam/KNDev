const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? `/department/${page}/` : '/',
  // publicPath: `/department/${dept}/{{token}}/`,
  // publicPath: `/department/${page}/`,
  outputDir: `../../backend/web/pages/login`,
  // assetsDir: dept,
  // indexPath: page + '.html',
  productionSourceMap: false,
  filenameHashing: false,
  css: { sourceMap: false, extract: false },
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 5001,
  },
  configureWebpack: {
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
    optimization: {
      splitChunks: false, // makes there only be 1 js file - leftover from earlier attempts but doesn't hurt
    },
    plugins: [
      new CompressionPlugin({
        filename: '[path].gz[query]',
        // filename(info) {
        //   if (info.path === 'login.html') info.path = 'login.html'
        //   return `${info.path}.gz${info.query}`
        // },
        algorithm: 'gzip',
        // test: /\.vue$|\.js$|\.css$|\.html$|\.eot$|\.ttf$|\.woff$|\.woff2$|\.ico$|\.png$/,
        test: /\.vue$|\.js$|\.css$|\.eot$|\.ttf$|\.woff$|\.woff2$|\.ico$|\.png$/,
        cache: true,
        minRatio: 0.8,
        compressionOptions: { level: 9 },
      }),
      new HtmlWebpackPlugin({
        // filename: 'login.html',
        template: 'public/template.html', // this is important - a template file to use for insertion
        inlineSource: '.(js|css)$', // embed all javascript and css inline
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
    ],
    output: {
      globalObject: 'this',
    },
  },
}
