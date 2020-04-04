module.exports = function ({ prod = false, dev = true } = {}) {
	return function (neutrino) {
		let devMode = neutrino.config.get('mode') === 'development';
		let productionSourcemap = Boolean(prod);
		let developmentSourcemap = Boolean(dev);
		let sourceMap = Boolean(devMode && developmentSourcemap) || Boolean(productionSourcemap);
		let styleRule = neutrino.config.module.rules.get('style');

		function configureSourceMap (use) {
			use.tap(options => Object.assign({}, options, { sourceMap }));
		}
		function isConfigurable (use) {
			const COMPATIBLE_NAME_EXPRESSION = /^(css|less|sass|postcss)$/i;

			return COMPATIBLE_NAME_EXPRESSION.test(use.name);
		}

		if (styleRule) {
			let oneOfs = styleRule.oneOfs.values();
			let uses = styleRule.uses.values();

			uses
				.filter(isConfigurable)
				.forEach(configureSourceMap);

			oneOfs
				.map(oneOf => oneOf.uses.values())
				.reduce((allUses, oneOfuses) => allUses.concat(oneOfuses), [])
				.filter(isConfigurable)
				.forEach(configureSourceMap);
		}
	};
};