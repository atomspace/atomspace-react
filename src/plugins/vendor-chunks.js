// Reference: https://webpack.js.org/plugins/commons-chunk-plugin/

let { CommonsChunkPlugin } = require('webpack').optimize;

module.exports = function ({ config }) {
	function isVendorModule (module) {
		if (module.resource && (/^.*\.(css|scss|sass|less|styl|pcss)$/).test(module.resource)) {
			return false;
		}
		return module.context && module.context.includes('node_modules');
	}

	config
		.plugin('vendor-chunk')
			.use(CommonsChunkPlugin, [{
				name: 'vendor',
				minChunks: isVendorModule
			}])
			.end()
		.plugin('common-chunk')
			.use(CommonsChunkPlugin, [{
				children: true,
				deepChildren: true,
				async: 'common',
				minChunks: 2
			}])
			.end();
};