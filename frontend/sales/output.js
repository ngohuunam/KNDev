{
  mode: 'development',
  context: 'K:\\KNDev\\frontend\\sales',
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  output: {
    path: 'K:\\KNDev\\backend\\web\\pages\\sales\\home',
    filename: '[name].js',
    publicPath: '/sales/home/',
    chunkFilename: '[name].js',
    globalObject: 'this'
  },
  resolve: {
    alias: {
      '@': 'K:\\KNDev\\frontend\\sales\\src',
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
    extensions: [
      '.mjs',
      '.js',
      '.jsx',
      '.vue',
      '.json',
      '.wasm'
    ],
    modules: [
      'node_modules',
      'K:\\KNDev\\frontend\\sales\\node_modules',
      'K:\\KNDev\\frontend\\sales\\node_modules\\@vue\\cli-service\\node_modules'
    ],
    plugins: [
      {
        apply: function nothing() {
          // ¯\_(ツ)_/¯
        },
        makePlugin: function () { /* omitted long function */ },
        moduleLoader: function () { /* omitted long function */ },
        topLevelLoader: {
          apply: function nothing() {
            // ¯\_(ツ)_/¯
          }
        },
        bind: function () { /* omitted long function */ },
        tsLoaderOptions: function () { /* omitted long function */ },
        forkTsCheckerOptions: function () { /* omitted long function */ }
      }
    ]
  },
  resolveLoader: {
    modules: [
      'K:\\KNDev\\frontend\\sales\\node_modules\\@vue\\cli-plugin-babel\\node_modules',
      'node_modules',
      'K:\\KNDev\\frontend\\sales\\node_modules',
      'K:\\KNDev\\frontend\\sales\\node_modules\\@vue\\cli-service\\node_modules'
    ],
    plugins: [
      {
        apply: function nothing() {
          // ¯\_(ツ)_/¯
        }
      }
    ]
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      /* config.module.rule('vue') */
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\cache-loader\\dist\\cjs.js',
            options: {
              cacheDirectory: 'K:\\KNDev\\frontend\\sales\\node_modules\\.cache\\vue-loader',
              cacheIdentifier: '40f7364a'
            }
          },
          {
            loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\vue-loader\\lib\\index.js',
            options: {
              compilerOptions: {
                whitespace: 'condense'
              },
              cacheDirectory: 'K:\\KNDev\\frontend\\sales\\node_modules\\.cache\\vue-loader',
              cacheIdentifier: '40f7364a'
            }
          }
        ]
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 4096,
              fallback: {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\file-loader\\dist\\cjs.js',
                options: {
                  name: 'img/[name].[ext]'
                }
              },
              name: '[name].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\file-loader\\dist\\cjs.js',
            options: {
              name: 'img/[name].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 4096,
              fallback: {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\file-loader\\dist\\cjs.js',
                options: {
                  name: 'media/[name].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\url-loader\\dist\\cjs.js',
            options: {
              limit: 4096,
              fallback: {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\file-loader\\dist\\cjs.js',
                options: {
                  name: 'fonts/[name].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('pug') */
      {
        test: /\.pug$/,
        oneOf: [
          /* config.module.rule('pug').rule('pug-vue') */
          {
            resourceQuery: /vue/,
            use: [
              {
                loader: 'pug-plain-loader'
              }
            ]
          },
          /* config.module.rule('pug').rule('pug-template') */
          {
            use: [
              {
                loader: 'raw-loader'
              },
              {
                loader: 'pug-plain-loader'
              }
            ]
          }
        ]
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        oneOf: [
          /* config.module.rule('css').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('css').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('css').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('css').rule('normal') */
          {
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('postcss') */
      {
        test: /\.p(ost)?css$/,
        oneOf: [
          /* config.module.rule('postcss').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('postcss').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('postcss').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          },
          /* config.module.rule('postcss').rule('normal') */
          {
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('scss') */
      {
        test: /\.scss$/,
        oneOf: [
          /* config.module.rule('scss').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').rule('normal') */
          {
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('sass') */
      {
        test: /\.sass$/,
        oneOf: [
          /* config.module.rule('sass').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').rule('normal') */
          {
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        oneOf: [
          /* config.module.rule('less').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').rule('normal') */
          {
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('stylus') */
      {
        test: /\.styl(us)?$/,
        oneOf: [
          /* config.module.rule('stylus').rule('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          },
          /* config.module.rule('stylus').rule('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          },
          /* config.module.rule('stylus').rule('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          },
          /* config.module.rule('stylus').rule('normal') */
          {
            use: [
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  hmr: true,
                  publicPath: ''
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              {
                loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\postcss-loader\\src\\index.js',
                options: {
                  sourceMap: false,
                  plugins: [
                    function () { /* omitted long function */ }
                  ]
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false,
                  preferPathResolver: 'webpack'
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.m?jsx?$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          {
            loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\cache-loader\\dist\\cjs.js',
            options: {
              cacheDirectory: 'K:\\KNDev\\frontend\\sales\\node_modules\\.cache\\babel-loader',
              cacheIdentifier: '5f44c45a'
            }
          },
          {
            loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\babel-loader\\lib\\index.js'
          }
        ]
      },
      /* config.module.rule('eslint') */
      {
        enforce: 'pre',
        test: /\.(vue|(j|t)sx?)$/,
        exclude: [
          /node_modules/,
          'K:\\KNDev\\frontend\\sales\\node_modules\\@vue\\cli-service\\lib'
        ],
        use: [
          {
            loader: 'K:\\KNDev\\frontend\\sales\\node_modules\\eslint-loader\\index.js',
            options: {
              extensions: [
                '.js',
                '.jsx',
                '.vue'
              ],
              cache: true,
              cacheIdentifier: 'd122bb94',
              emitWarning: false,
              emitError: false,
              eslintPath: 'K:\\KNDev\\frontend\\sales\\node_modules\\eslint',
              formatter: undefined
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      {
        options: {
          test: /\.m?js(\?.*)?$/i,
          chunkFilter: () => true,
          warningsFilter: () => true,
          extractComments: false,
          sourceMap: false,
          cache: true,
          cacheKeys: defaultCacheKeys => defaultCacheKeys,
          parallel: true,
          include: undefined,
          exclude: undefined,
          minify: undefined,
          terserOptions: {
            compress: {
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true
            },
            mangle: {
              safari10: true
            }
          }
        }
      }
    ]
  },
  plugins: [
    /* config.plugin('vue-loader') */
    new VueLoaderPlugin(),
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"development"',
          BASE_URL: '"/sales/home/"'
        }
      }
    ),
    /* config.plugin('case-sensitive-paths') */
    new CaseSensitivePathsPlugin(),
    /* config.plugin('friendly-errors') */
    new FriendlyErrorsWebpackPlugin(
      {
        additionalTransformers: [
          function () { /* omitted long function */ }
        ],
        additionalFormatters: [
          function () { /* omitted long function */ }
        ]
      }
    ),
    /* config.plugin('extract-css') */
    new MiniCssExtractPlugin(
      {
        filename: '[name].css',
        chunkFilename: '[name].css'
      }
    ),
    /* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        title: '08:29:45, 16/4/2020',
        templateParameters: function () { /* omitted long function */ },
        template: 'K:\\KNDev\\frontend\\sales\\public\\index.html'
      }
    ),
    /* config.plugin('preload') */
    new PreloadPlugin(
      {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [
          /\.map$/,
          /hot-update\.js$/
        ]
      }
    ),
    /* config.plugin('prefetch') */
    new PreloadPlugin(
      {
        rel: 'prefetch',
        include: 'asyncChunks'
      }
    ),
    /* config.plugin('copy') */
    new CopyPlugin(
      [
        {
          from: 'K:\\KNDev\\frontend\\sales\\public',
          to: 'K:\\KNDev\\backend\\web\\pages\\sales\\home',
          toType: 'dir',
          ignore: [
            '.DS_Store',
            {
              glob: 'index.html',
              matchBase: false
            }
          ]
        }
      ]
    ),
    {
      options: {
        globalObject: 'self',
        sharedWorker: true,
        worker: false,
        filename: '[name].worker.js'
      }
    },
    {
      options: {
        template: 'public/template.html',
        templateContent: false,
        templateParameters: function () { /* omitted long function */ },
        filename: 'index_.html',
        hash: false,
        inject: 'body',
        scriptLoading: 'blocking',
        compile: true,
        favicon: false,
        minify: 'auto',
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        chunksSortMode: 'auto',
        meta: {},
        base: false,
        title: '08:29:41, 16/4/2020',
        xhtml: false,
        inlineSource: '.(js|css)$'
      },
      childCompilerHash: undefined,
      assetJson: undefined,
      hash: undefined,
      version: 4
    },
    {
      htmlWebpackPlugin: function () { /* omitted long function */ }
    },
    {
      options: {
        test: /\.vue$|\.js$|\.css$|\.html$|\.eot$|\.ttf$|\.woff$|\.woff2$|\.ico$/,
        include: undefined,
        exclude: undefined,
        cache: true,
        algorithm: function () { /* omitted long function */ },
        compressionOptions: {
          level: 11
        },
        filename: '[path].br[query]',
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false
      }
    }
  ],
  entry: {
    app: [
      './src/main.js'
    ]
  },
  performance: {
    hints: false
  }
}
