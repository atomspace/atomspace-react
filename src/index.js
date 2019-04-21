let react = require('@neutrinojs/react');
let WebpackBar = require('webpackbar');
let less = require('neutrino-middleware-less-loader');

module.exports = function (neutrino, settings) {
	let { config } = neutrino;
	let styleExtensions = /\.(css|scss|sass|less)$/;
	let jsxExtensions = /\.(jsx|tsx)$/;
	let appName = `${neutrino.options.packageJson.name} (React)`;

	// Before JS pre-processors
	config.module
		.rule('scoped-jsx')
			.test(jsxExtensions)
			.use('react-scoped-styles')
				.loader(require.resolve('react-scoped-styles/script-loader'));

	neutrino.use(react, settings);

	// Before CSS pre-processors
	config.module
		.rule('scoped-style')
			.test(styleExtensions)
			.use('react-scoped-styles')
				.loader(require.resolve('react-scoped-styles/style-loader'))
				.end();

	neutrino.use(less);

	config
		.plugin('progress')
			.use(WebpackBar, [{
				name: appName,
				color: 'green',
				profile: false
			}])
			.end();

	// console.log(JSON.stringify(config.toConfig().module.rules, null, 2));
	// console.log(config.toConfig().module.rules);
};