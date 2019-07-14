let arrify = require('arrify');

module.exports = function ({ config, options }) {
	const LOADER_EXTENSIONS = /\.mdx$/;
	let mdxLoader = require.resolve('mdx-loader');
	let compileRule = config.module.rule('compile');
	let compileExtensions = arrify(compileRule.get('test')).concat(LOADER_EXTENSIONS);

	options.extensions.push('mdx');

	config.module
		.rule('compile')
			.test(compileExtensions)
			.end()
		.rule('markdown-jsx')
			.test(LOADER_EXTENSIONS)
			.use('mdx')
				.loader(mdxLoader)
				.end()
			.end();
};