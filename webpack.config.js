const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const pages = {
	fusions: {
		"title": "Fusion list",
		"entry": "fusions"
	},
	search: {
		"title": "Card search",
		"entry": "search"
	}
};

module.exports = env => {
	let debug = env.NODE_ENV !== "production";
	console.log("Build type: " + debug ? "DEBUG" : "PRODUCTION");

	let plugins = [];

	// Add CSS extract plugin (but only enabled in production)
	if (debug) {
		plugins.push(new ExtractTextPlugin({
			disable: true
		}));
	} else {
		plugins.push(new ExtractTextPlugin({
			filename: "screen.css",
			allChunks: true
		}));
	}

	// Add outputs (no CSS in debug)
	const cssfiles = debug ? [] : [ "screen.css" ];
	let entries = {};
	for (let pageid in pages) {
		entries[pageid] = "./app/" + pageid;
		plugins.push(new HtmlWebpackPlugin({
			inject: false,
			filename: pageid + ".html",
			title: pages[pageid].title + " (FMTK)",
			chunks: [pageid],
			css: cssfiles,
			appMountId: "app",
			mobile: true,
			lang: "en-US",
			template: "./template.ejs",
			pageid: pageid
		}));
	}

	let devServer = {};
	let devtool = false;

	// Add debug probes and plugins if not in a production build
	if (debug) {
		// Wrap entrypoints
		const wrapEntry = entrypoint => [
			"react-hot-loader/patch",
			"webpack-dev-server/client?http://172.16.0.100:8080",
			"webpack/hot/only-dev-server",
			entrypoint
		];
		for (let entry in entries) {
			entries[entry] = wrapEntry(entries[entry]);
		}

		// Add extra plugins
		plugins.push(new webpack.HotModuleReplacementPlugin());
		plugins.push(new webpack.NamedModulesPlugin());
		plugins.push(new webpack.NoEmitOnErrorsPlugin());

		devtool = "inline-source-map";
		devServer = {
			host: "0.0.0.0",
			port: 8080,
			historyApiFallback: true,
			hot: true,
			disableHostCheck: true
		};
	}

	return {
		module: {
			rules: [{
				test: /\.jsx?/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								["env", {
									"targets": {
										"browsers": ["last 2 versions", "safari >= 7"]
									},
									"modules": false
								}],
								"react"
							],
							plugins: [
								"syntax-async-functions",
								"transform-class-properties",
								"react-hot-loader/babel"
							]
						}
					}
				],
				exclude: /node_modules/
			}, {
				test: /\.eot|.otf|.woff|\.ttf|\.svg|\.png/,
				use: "file-loader"
			}, {
				test: /^((?!\.module).)*\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{
						loader: "css-loader"
					}, {
						loader: "sass-loader",
						options: { sourceMap: true }
					}]
				})
			}, {
				test: /\.module\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{
						loader: "css-loader",
						options: {
							modules: true,
							importLoaders: 1,
							localIdentName: "[path][name]__[local]--[hash:base64:5]"
						}
					}, {
						loader: "sass-loader",
						options: { sourceMap: true }
					}]
				})
			}, {
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{loader: "css-loader"}]
				})
			}]
		},
		entry: entries,
		output: {
			filename: "[name].js",
			path: path.join(__dirname, "dist")
		},
		resolve: {
			extensions: [".js", ".jsx"]
		},
		plugins,
		devServer,
		devtool
	};
};