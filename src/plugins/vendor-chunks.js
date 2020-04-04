// Reference: https://webpack.js.org/plugins/commons-chunk-plugin/

let { CommonsChunkPlugin } = require('webpack').optimize;

module.exports = function (neutrino) {
	function isVendorModule (module) {
		if (module.resource && (/^.*\.(css|scss|sass|less|styl|pcss)$/).test(module.resource)) {
			return false;
		}
		return module.context && module.context.includes('node_modules');
	}

	neutrino.config
		.plugin('vendor-chunk')
			.use(CommonsChunkPlugin, [{
				name: 'vendor',
				minChunks: isVendorModule,
				chunks: Object.keys(neutrino.options.mains)
			}])
			.end()

		// .plugin('runtime-chunk')
		// 	.use(CommonsChunkPlugin, [{
		// 		name: 'runtime',
		// 		chunks: Object.keys(neutrino.options.mains).concat(['vendor'])
		// 	}])
		// 	.end()
		.plugin('common-chunk')
			.use(CommonsChunkPlugin, [{
				children: true,
				deepChildren: true,
				async: 'common',
				minChunks: 2
			}])
			.end();
};