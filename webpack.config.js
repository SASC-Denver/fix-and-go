const CopyPlugin              = require('copy-webpack-plugin')
const {CleanWebpackPlugin}    = require('clean-webpack-plugin')
const HtmlWebpackPlugin       = require('html-webpack-plugin')
const MiniCssExtractPlugin    = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path                    = require('path')
const TerserJSPlugin          = require('terser-webpack-plugin')
const webpack                 = require('webpack')
var ManifestPlugin            = require('webpack-manifest-plugin')
const WebpackShellPlugin      = require('webpack-shell-plugin')

const devMode = process.env.NODE_ENV !== 'production'

const manifestOpts = {
	seed: {
		'display': 'standalone',
		'orientation': 'portrait',
		'start_url': '/',
		'theme_color': '#000000',
		'background_color': '#ffffff',
	}
}

const htmlOpts = {
	meta: {
		'viewport': 'width=device-width'
	},
	title: 'Votecube'
}

const mode = devMode ? 'development' : 'production'

const staticHashNum = new Date().getTime()
const staticHash    = staticHashNum.toString(36)

function optimizeJson(
	json
) {
	// return JSON.stringify(JSON.parse(json))
	return json
}

module.exports = {
	devServer: {
		host: '0.0.0.0',
		// https://github.com/webpack/webpack-dev-server/issues/1604
		disableHostCheck: true
	},
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].[hash:12].js',
		chunkFilename: '[name].[chunkhash:12].[id].js'
	},

	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				jssha: {
					test: (module) => {
						const context = module.context
						const targets = [
							'jssha',
						]
						return context && context.indexOf('node_modules') >= 0 && targets.find(t => context.indexOf(/${t}/) > -1)
					},
					name: 'jssha',
					chunks: 'all'
				},
				vendor: {
					test: (module) => {
						const context = module.context
						const targets = [
							'firebase',
							'page',
							'svelte',
							'svelte-transitions',
						]
						return context && context.indexOf('node_modules') >= 0 && targets.find(t => context.indexOf(/${t}/) > -1)
					},
					name: 'vendor',
					chunks: 'all'
				},
				votecube: {
					test: (module) => {
						const context = module.context
						const targets = [
							'@votecube',
						]
						return context && context.indexOf('node_modules') >= 0 && targets.find(t => context.indexOf(/${t}/) > -1)
					},
					name: 'votecube',
					chunks: 'all'
				},
			},
		},
		minimizer: [new TerserJSPlugin({
			cache: true,
			parallel: true
		}), new OptimizeCSSAssetsPlugin({})],
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						// skipIntroByDefault: true,
						// nestedTransitions: true,
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: devMode,
						},
					},
					'css-loader'
				]
			}
		]
	},
	mode,
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin([
			{
				from: 'src/assets/text/en-us/*.json',
				to: 'assets/text/en-us/[name].' + staticHash + '.[ext]',
				transform(
					content,
					path
				) {
					return optimizeJson(content)
				},
				cache: true,
			},
			{
				from: 'src/assets/data/*.json',
				to: 'assets/data/[name].' + staticHash + '.[ext]',
				transform(
					content,
					path
				) {
					return optimizeJson(content)
				},
				cache: true,
			},
		]),
		new HtmlWebpackPlugin(htmlOpts),
		new ManifestPlugin(manifestOpts),
		new MiniCssExtractPlugin({
			filename: devMode ? '[name].css' : '[name].[contenthash].css'
		}),
		new WebpackShellPlugin({
			onBuildStart: ['node build/setHash.js ' + staticHash],
			onBuildEnd: ['node build/addManifest.js ' + staticHash]
		})
	],
	devtool: devMode ? 'source-map' : false
}
