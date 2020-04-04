let deepmerge = require('deepmerge');

module.exports = function () {
	return function (neutrino) {
		let lintRule = neutrino.config.module.rules.get('lint');

		if (lintRule) {
			lintRule.use('eslint').tap(options => deepmerge(options, {
				baseConfig: {
					env: {
						browser: true,
						commonjs: true
					},
					settings: {
						react: {
							version: 'detect'
						}
					}
				}
			}));
		}
	};
};