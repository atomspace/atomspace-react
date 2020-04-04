let cssSourcemap = require('./css-sourcemap');
let jsSourcemap = require('./js-sourcemap');

module.exports = function ({ prod = false, dev = true } = {}) {
	return function (neutrino) {
		let devMode = neutrino.config.get('mode') === 'development';

		neutrino.use(cssSourcemap({ prod, dev }));
		neutrino.use(jsSourcemap({ prod, dev }));
		neutrino.config
			.when(devMode, function (config) {
				config
					.module
						.rule('source-map')
							.test(/\.js$/i)
							.pre()
							.include
								.add(/node_modules/)
								.end()
							.use('smart-source-map')
								.loader(require.resolve('smart-source-map-loader'))
								.end()
							.end()
						.end();
			});
	};
};