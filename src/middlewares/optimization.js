let deepmerge = require('deepmerge');

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		const MAX_ASSET_SIZE = 2500000;
		let devMode = neutrino.config.get('mode') === 'development';
		let prodMode = !devMode;
		let defaultSettings = {
			chunks: true,
			minimize: true
		};
		let settings = deepmerge(defaultSettings, customSettings);

		// https://github.com/neutrinojs/neutrino/tree/master/packages/style-minify
		// https://linguinecode.com/post/reduce-css-file-size-webpack-tree-shaking
		neutrino.config
			.performance
				.maxAssetSize(MAX_ASSET_SIZE)
				.assetFilter(fileName => fileName.endsWith('.js') || fileName.endsWith('.css'))
				.end()
			.optimization
				.minimize(prodMode)
				.runtimeChunk(false)
				.set('moduleIds', devMode ? 'named' : 'hashed')
				.set('chunkIds', devMode ? 'named' : 'total-size')
				.removeAvailableModules(prodMode)
				.removeEmptyChunks(prodMode)
				.mergeDuplicateChunks(true)
				.flagIncludedChunks(prodMode)
				.occurrenceOrder(prodMode)
				.splitChunks({
					chunks: 'all',
					name: false,
					maxInitialRequests: 6,
					maxAsyncRequests: 6,
					minSize: 30000,
					maxSize: MAX_ASSET_SIZE,
					minChunks: 2,
					cacheGroups: {
						default: false,
						vendors: {
							test: /[/\\]node_modules[/\\]/,
							name: 'vendor',
							chunks: 'initial',
							enforce: true
						},
						common: {
							// idHint: 'common',
							name: devMode,
							chunks: 'all',
							minChunks: 2,
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