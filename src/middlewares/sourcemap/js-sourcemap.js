let path = require('path');

module.exports = function ({ prod = false, dev = true } = {}) {
	return function (neutrino) {
		let devMode = neutrino.config.get('mode') === 'development';
		let productionSourcemap = prod ? 'source-map' : false;
		let developmentSourcemap = dev ? 'eval-cheap-module-source-map' : false; // eval-cheap-module-source-map, inline-cheap-module-source-map, cheap-module-source-map

		function productionFilenameTemplate (info) {
			return path.relative(neutrino.options.output, info.absoluteResourcePath).replace(/\\/g, '/');
		}
		function developmentFilenameTemplate (info) {
			let fileProtocol = info.absoluteResourcePath.charAt(0) === '/' ? 'file://' : 'file:///';
			let absoluteUrl = path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');

			return `${fileProtocol}${absoluteUrl}`;
		}

		neutrino.config
			.devtool(productionSourcemap)
			.output
				.devtoolModuleFilenameTemplate(productionFilenameTemplate)
				.end()
			.when(devMode, function (config) {
				config
					.devtool(developmentSourcemap)
					.output
						.devtoolModuleFilenameTemplate(developmentFilenameTemplate)
						.end();
			});
	};
};