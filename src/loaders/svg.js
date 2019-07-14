module.exports = function ({ config }) {
	let svgUrlLoader = require.resolve('svg-url-loader');

	config.module
		.rules.delete('svg')
		.end()

		// .rule('image')
		// 	.test(/\.(ico|png|jpg|jpeg|gif|webp)(\?v=\d+\.\d+\.\d+)?$/)
		// 	.end()

		.rule('svg')
			.test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
			.oneOf('style')
				.set('issuer', /\.(css|less|sass|scss)$/)
				.use('svg-css')
					.loader(svgUrlLoader)
					.options({ limit: 10000, noquotes: false, stripdeclarations: true })
					.end()
				.end()
			.oneOf('text')
				.use('svg-text')
					.loader(svgUrlLoader)
					.options({ limit: 0, noquotes: true })
					.end()
				.end()
			.end();
};