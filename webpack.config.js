const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const pages = {
	fusions: {
		"title": "Fusion list",
		"entry": "fusions"
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
			filename: pageid + ".html",
			title: "FMTK " + pages[pageid].title,
			js: [pages[pageid].entry + ".js"],
			css: cssfiles,
			appMountId: "app",
			mobile: true,
			lang: "en-US",
			template: "template.ejs"
		}));
	}

	let devServer = {};
	let devtool = false;

	// Add debug probes and plugins if not in a production build
	if (debug) {
		// Wrap entrypoints
		const wrapEntry = entrypoint => [
			"react-hot-loader/patch",
			"webpack-dev-server/client?http://192.168.3.13:8080",
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
								["es2015", { "modules": false }],
								"react"
							],
							plugins: [
								"syntax-async-functions",
								"react-hot-loader/babel"
							]
						}
					}
				],
				exclude: /node_modules/
			}, {
				test: /\.eot|.otf|.woff|\.ttf/,
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