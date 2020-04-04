let deepmerge = require('deepmerge');

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		let devMode = neutrino.config.get('mode') === 'development';
		let prodMode = !devMode;
		let defaultSettings = {
			chunks: true,
			minimize: true
		};
		let settings = deepmerge(defaultSettings, customSettings);

		// https://github.com/neutrinojs/neutrino/tree/master/packages/style-minify
		neutrino.config
			.optimization
				.minimize(prodMode)
				.runtimeChunk({ name: 'runtime' })
				.set('moduleIds', devMode ? 'named' : 'hashed')
				.set('chunkIds', devMode ? 'named' : 'total-size')
				.removeAvailableModules(prodMode)
				.removeEmptyChunks(prodMode)
				.mergeDuplicateChunks(true)
				.flagIncludedChunks(prodMode)
				.occurrenceOrder(prodMode)
				.splitChunks({
					// chunks: 'async',
					// chunks: 'all',
					// maxInitialRequests: Infinity,
					// maxAsyncRequests: 1,
					// minSize: 0,
					cacheGroups: {
						vendor: {
							test: /[/\\]node_modules[/\\]/,
							name: 'vendor',
							chunks: 'all',
							priority: -10
						},
						default: {
							minChunks: 2,
							priority: -20,
							reuseExistingChunk: true
						}
					}
				})
				.when(!settings.minimize, function (optimization) {
					optimization.minimize(false);
				})
				.when(!settings.chunks, function (optimization) {
					optimization
						.runtimeChunk(false)
						.splitChunks({
							default: false,
							vendors: false
						});
				})
				.end();
	};
};