let path = require('path');
let fs = require('fs');

let deepmerge = require('deepmerge');
let react = require('@neutrinojs/react');
let WebpackBar = require('webpackbar');
let less = require('neutrino-middleware-less-loader');
let CircularDependencyPlugin = require('circular-dependency-plugin');
let { shouldPrintComment } = require('babel-plugin-smart-webpack-import');

let svg = require('./loaders/svg');
let mdx = require('./loaders/mdx');
let vendorChunks = require('./plugins/vendor-chunks');
let env = require('./plugins/env');
let bundleAnalyzer = require('./plugins/bundle-analyzer');

module.exports = function (neutrino, customSettings = {}) {
	const NODE_MODULES = path.resolve(__dirname, '../node_modules');
	const LAUNCHER_PATH = path.resolve(__dirname, './launcher.js');
	const FAVICON_PATH = path.resolve(neutrino.options.source, 'favicon.ico');
	let devMode = (process.env.NODE_ENV === 'development');
	let { config } = neutrino;
	let styleExtensions = /\.(css|scss|sass|less|styl|pcss)$/;
	let jsxExtensions = /\.(jsx|tsx)$/;
	let { name, version } = neutrino.options.packageJson;
	let appName = `${name} ${version}`;
	let defaultSettings = {
		launcher: true,
		browsers: customSettings.browsers ? [] : [
			'last 2 Chrome major versions',
			'last 2 Firefox major versions',
			'last 2 Edge major versions',
			'last 2 Opera major versions',
			'last 2 Safari major versions',
			'last 2 iOS major versions',
			'ie 11'
		],
		title: appName,
		polyfills: true,
		server: {
			port: 3000,
			host: 'localhost'
		}
	};
	let faviconExists = fs.existsSync(FAVICON_PATH);
	let settings = deepmerge(defaultSettings, customSettings);
	let scopedStylesSettings = {
		globalsPrefix: 'app'
	};
	let reactSettings = {
		hot: true,
		devServer: {
			hot: true,
			port: settings.server.port,
			host: settings.server.host
		},
		polyfills: {
			async: settings.polyfills
		},
		html: {
			title: settings.title,
			favicon: faviconExists ? FAVICON_PATH : ''
		},
		targets: {
			browsers: settings.browsers
		}
	};
	let useLauncher = Boolean(settings.launcher);

	// Before JS pre-processors
	config.module
		.rule('scoped-jsx')
			.test(jsxExtensions)
			.include
				.merge([neutrino.options.source, neutrino.options.tests])
				.end()
			.use('react-scoped-styles')
				.loader(require.resolve('./loaders/scoped-styles/script-loader'))
				.options(scopedStylesSettings);

	neutrino.use(react, reactSettings);

	// Before CSS pre-processors
	config.module
		.rule('scoped-style')
			.test(styleExtensions)
			.include
				.merge([neutrino.options.source, neutrino.options.tests])
				.end()
			.set('issuer', jsxExtensions)
			.use('react-scoped-styles')
				.loader(require.resolve('./loaders/scoped-styles/style-loader'))
				.options(scopedStylesSettings)
				.end();

	neutrino.use(less);
	neutrino.use(svg);
	neutrino.use(mdx);
	neutrino.use(vendorChunks);
	neutrino.use(env);
	neutrino.use(bundleAnalyzer);

	config
		.output
			.publicPath('/')
			.end()
		.devtool(devMode ? 'eval-source-map' : 'source-map')
		.resolve.modules
			.add(NODE_MODULES)
			.end().end()
		.resolveLoader.modules
			.add(NODE_MODULES)
			.end().end()
		.plugin('progress')
			.use(WebpackBar, [{
				name: `${appName} (React)`,
				color: 'green',
				profile: false

				// fancy: true // true when not in CI or testing mode
				// basic: true // true when running in minimal environments.
			}])
			.end()
		.plugin('depend')
			.use(CircularDependencyPlugin, [{
				exclude: /node_modules/,
				failOnError: false,
				allowAsyncCycles: true,
				cwd: process.cwd()
			}])
			.end()
		.module
			.rule('compile')
				.use('babel')
					.tap(function (options) {
						options.plugins.unshift(
							require.resolve('babel-plugin-transform-decorators-legacy'),
							require.resolve('babel-plugin-transform-class-properties'),
							[require.resolve('babel-plugin-transform-jsx-url'), {
								root: neutrino.options.source,
								attrs: ['img:src', 'link:href', 'Image:src', 'video:src', 'Video:src', 'audio:src']
							}],
							require.resolve('babel-plugin-smart-webpack-import')
						);
						options.shouldPrintComment = shouldPrintComment;

						return options;
					})
					.end()
				.end()
			.when(devMode, function (module) {
				module.rule('source-map')
					.test(/\.js$/i)
					.pre()
					.include
						.add(/node_modules/)
						.end()
					.use('smart-source-map')
						.loader(require.resolve('smart-source-map-loader'))
						.end()
					.end();

				module.rule('compile')
					.use('babel')
						.tap(function (options) {
							options.plugins.push(
								require.resolve('babel-plugin-transform-react-jsx-source')
							);

							return options;
						})
						.end()
					.end();
			});

	Object.keys(neutrino.options.mains).forEach(function (key) {
		neutrino.config
			.entry(key)
				.when(useLauncher, function (entry) {
					let values = entry.values();
					let lastValue = values[values.length - 1];

					entry.delete(lastValue).add(LAUNCHER_PATH);
				})
				.end()
		.resolve.alias
			.when(useLauncher, function (alias) {
				alias.set('__entry__', path.resolve(__dirname, neutrino.options.mains[key]));
			})
			.end();
	});


	// console.log(JSON.stringify(config.toConfig().module.rules, null, 2));
	// console.log(config.toConfig().module.rules);
	// console.log(config.toConfig());
};