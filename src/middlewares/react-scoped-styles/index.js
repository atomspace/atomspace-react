const { ConfigurationError } = require('neutrino/errors');

const STYLE_EXTENSIONS = /\.(css|scss|sass|less|styl|pcss)$/;
const JSX_EXTENSIONS = /\.(jsx|tsx)$/;
let scopedStylesSettings = {
	globalsPrefix: 'app'
};

function reactScopedComponent () {
	return function (neutrino) {
		neutrino.config.module
			.rule('scoped-component')
				.test(JSX_EXTENSIONS)
				.post() // Should process pure JS after all transformations
				.include
					.merge([neutrino.options.source, neutrino.options.tests])
					.end()
				.use('react-scoped-styles')
					.loader(require.resolve('./component-loader'))
					.options(scopedStylesSettings);
	};
}

function reactScopedStyle () {
	return function (neutrino) {
		let styleRule = neutrino.config.module.rules.get('style');

		if (!styleRule) {
			throw new ConfigurationError(`'react-scoped-styles' middleware requires 'neutrino.config.module.rule('style')' to be defined before`);
		}

		neutrino.config.module
			.rule('scoped-style')
				.after('style') // Should process pure CSS before it is passed to css-loader but after CSS preprocessors
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
}

module.exports = function () {
	return function (neutrino) {
		neutrino.use(reactScopedComponent());
		neutrino.use(reactScopedStyle());
	};
};
module.exports.reactScopedComponent = reactScopedComponent;
module.exports.reactScopedStyle = reactScopedStyle;