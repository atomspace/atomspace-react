let path = require('path');

let react = require('@neutrinojs/react');
let WebpackBar = require('webpackbar');
let less = require('neutrino-middleware-less-loader');
let { DefinePlugin } = require('webpack');


module.exports = function (neutrino, settings) {
	const NODE_MODULES = path.resolve(__dirname, '../node_modules');
	const LAUNCHER_PATH = path.resolve(__dirname, './launcher.js');
	let devMode = (process.env.NODE_ENV === 'development');
	let { config } = neutrino;
	let styleExtensions = /\.(css|scss|sass|less)$/;
	let jsxExtensions = /\.(jsx|tsx)$/;
	let appName = `${neutrino.options.packageJson.name} (React)`;
	let useLauncher = true;

	// Before JS pre-processors
	config.module
		.rule('scoped-jsx')
			.test(jsxExtensions)
			.use('react-scoped-styles')
				.loader(require.resolve('react-scoped-styles/script-loader'));

	neutrino.use(react, {
		html: {
			title: appName
		}
	});

	// Before CSS pre-processors
	config.module
		.rule('scoped-style')
			.test(styleExtensions)
			.use('react-scoped-styles')
				.loader(require.resolve('react-scoped-styles/style-loader'))
				.end();

	neutrino.use(less);

	config
		.devtool(devMode ? 'eval-source-map' : 'source-map')
		.resolve.modules
			.add(NODE_MODULES)
			.end().end()
		.resolveLoader.modules
			.add(NODE_MODULES)
			.end().end()
		.plugin('progress')
			.use(WebpackBar, [{
				name: appName,
				color: 'green',
				profile: false

				// fancy: true // true when not in CI or testing mode
				// basic: true // true when running in minimal environments.
			}])
			.end()
		.plugin('define-env')
			.use(DefinePlugin, [{
				// REMOVE: '__http__': JSON.stringify(protocol)
			}])
			.end()
		.module
			.rule('compile')
				.use('babel')
				.tap(function (options) {
					options.plugins.unshift(
						require.resolve('babel-plugin-transform-decorators-legacy'),
						require.resolve('babel-plugin-transform-class-properties')
					);

					return options;
				})
				.end()
			.end();

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

			// .when(useLauncher && devMode, function (alias) {
			// 	alias.set('webpack/hot/log', require.resolve('webpack/hot/log'));
			// })
			.end();
	});


	// console.log(JSON.stringify(config.toConfig().module.rules, null, 2));
	// console.log(config.toConfig().module.rules);
	// console.log(config.toConfig());
};