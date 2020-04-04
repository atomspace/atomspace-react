const STYLE_EXTENSIONS = /\.(css|scss|sass|less|styl|pcss)$/;
const JSX_EXTENSIONS = /\.(jsx|tsx)$/;
let scopedStylesSettings = {
	globalsPrefix: 'app'
};

module.exports.reactScopedComponent = function () {
	return function (neutrino) {
		// Must be before JS pre-processors
		neutrino.config.module
			.rule('scoped-component')
				.test(JSX_EXTENSIONS)
				.include
					.merge([neutrino.options.source, neutrino.options.tests])
					.end()
				.use('react-scoped-styles')
					.loader(require.resolve('./component-loader'))
					.options(scopedStylesSettings);
	};
};

module.exports.reactScopedStyle = function () {
	return function (neutrino) {
		// Must be before CSS pre-processors
		neutrino.config.module
			.rule('scoped-style')
				.test(STYLE_EXTENSIONS)
				.include
					.merge([neutrino.options.source, neutrino.options.tests])
					.end()
				.set('issuer', JSX_EXTENSIONS)
				.use('react-scoped-styles')
					.loader(require.resolve('./style-loader'))
					.options(scopedStylesSettings)
					.end();
	};
};