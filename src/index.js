let path = require('path');
let fs = require('fs');

let less = require('neutrino-middleware-less-loader');
let deepmerge = require('deepmerge');
let web = require('@neutrinojs/web');
let react = require('@constgen/neutrino-react-loader');
let image = require('@constgen/neutrino-image-loader');
let svg = require('@constgen/neutrino-svg-loader');
let progress = require('@constgen/neutrino-progress');
let revision = require('@constgen/neutrino-revision');
let staticFiles = require('@constgen/neutrino-static-files');
let mdx = require('@constgen/neutrino-mdx-loader');
let analysis = require('@constgen/neutrino-analysis');
let env = require('@constgen/neutrino-env');
let reactLauncher = require('@constgen/neutrino-react-launcher');
let mode = require('@constgen/neutrino-mode');
let sourcemap = require('@constgen/neutrino-sourcemap');
let reactScopedStyles = require('@constgen/neutrino-react-scoped-styles');
let optimization = require('@constgen/neutrino-optimization');

let clean = require('./middlewares/clean');
let eslint = require('./middlewares/eslint');

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		let faviconPath = path.resolve(neutrino.options.source, 'favicon.ico');
		let faviconExists = fs.existsSync(faviconPath);
		let { name, version } = neutrino.options.packageJson;
		let appName = `${name} ${version}`;
		let defaultSettings = {
			launcher: true,
			open: false,
			server: {
				port: 3000,
				public: true,
				https: false,
				proxy: {}
			},
			sourcemaps: true,
			title: appName,
			polyfills: false,
			browsers: customSettings.browsers ? [] : [
				'last 2 Chrome major versions',
				'last 2 Firefox major versions',
				'last 2 Edge major versions',
				'last 2 Opera major versions',
				'last 2 Safari major versions',
				'last 2 iOS major versions',
				'ie 11'
			]
		};
		let settings = deepmerge(defaultSettings, customSettings);
		let webSettings = {
			publicPath: '/',
			hot: true,
			devServer: {
				open: settings.open,
				hot: true,
				port: settings.server.port,
				host: settings.server.public ? '0.0.0.0' : 'localhost',
				https: settings.server.https,
				proxy: settings.server.proxy,
				serveIndex: true,
				useLocalIp: settings.server.public,
				quiet: false,
				noInfo: false
			},
			html: {
				title: settings.title,
				favicon: faviconExists ? faviconPath : '',
				meta: {
					'X-UA-Compatible': { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge' }
				}
			}
		};
		let reactSettings = {
			browsers: settings.browsers,
			polyfills: settings.polyfills
		};

		neutrino.use(mode());
		neutrino.use(web(webSettings));
		neutrino.use(react(reactSettings));
		neutrino.use(reactScopedStyles());
		if (settings.launcher) neutrino.use(reactLauncher());
		neutrino.use(clean());
		neutrino.use(image());
		neutrino.use(svg());
		neutrino.use(mdx());
		neutrino.use(less());
		neutrino.use(progress({ name: settings.title }));
		neutrino.use(sourcemap({ prod: settings.sourcemaps }));
		neutrino.use(revision());
		neutrino.use(staticFiles());
		neutrino.use(env());
		neutrino.use(analysis());
		neutrino.use(optimization());
		neutrino.use(eslint());

		let devMode = neutrino.config.get('mode') === 'development';

		neutrino.config
			.name(settings.title)
			.node
				.set('Buffer', false)
				.set('process', false)
				.set('setImmediate', true)
				.end()
			.output
				.filename('compiled/[name].[contenthash:8].js')
				.when(devMode, function (output) {
					output.filename('[name].js');
				})
				.end()
			.module
				.rule('font')
					.use('file')
						.tap(options => Object.assign({}, options, {
							outputPath: 'fonts',
							name: '[name].[hash:8].[ext]'
						}))
						.when(devMode, function (use) {
							use.tap(options => Object.assign({}, options, {
								outputPath: undefined,
								name: '[path][name].[ext]'
							}));
						})
						.end()
					.end()
				.end()
			.when(neutrino.config.plugins.get('extract'), function (config) {
				config.plugin('extract')
					.set('args', [{
						filename: 'compiled/[name].[contenthash:8].css',
						ignoreOrder: true
					}])
					.when(devMode, function (plugin) {
						plugin.set('args', [{
							filename: '[name].css'
						}]);
					})
					.end();
			});
	};
};