const { CommonsChunkPlugin } = require('webpack').optimize;

module.exports = function ({ config }) {
	let prodMode = process.env.NODE_ENV === 'production';

	if (!prodMode) return;

	config
		.plugin('async-chunk')
			.use(CommonsChunkPlugin, [{
				children: true,
				async: true
			}])
			.end()
		.plugin('vendor-chunk')
			.use(CommonsChunkPlugin, [{
				name: 'vendor',
				minChunks (module) {
					if (module.resource && (/^.*\.(css|scss|sass|less|styl|pcss)$/).test(module.resource)) {
						return false;
					}
					return module.context && module.context.includes('node_modules');
				}
			}])
			.end();
};