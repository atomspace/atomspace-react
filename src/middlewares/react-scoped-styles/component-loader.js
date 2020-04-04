let { createDirHash } = require('./utils/dirhash');

module.exports = function componentLoader (source, sourceMaps) {
	let { globalsPrefix = 'app' } = this.query;
	const CLASS_EXPR = /classname:\s(["'].*?["']|.*?\))/gi;
	const CLASS_STRING_EXPRESSION = /["'|](.*?)["'|]/g;

	if (!source.match(CLASS_EXPR)) {
		return source;
	}
	let [dirName, dirHash] = createDirHash(this.context);

	function privateClassName (_match, classNames) {
		let uniqueClassNames = classNames.split(' ')
				.filter(Boolean)
				.map(className => {
					let containsPrefix = className.startsWith(`${globalsPrefix}-`);
					let uniqueClassName = `${dirName}-${dirHash}-${className}`;

					return containsPrefix ? className : uniqueClassName;
				})
				.join(' ');

		return `'${uniqueClassNames}'`;
	}

	let output = source.replace(CLASS_EXPR, classExpr => classExpr.replace(CLASS_STRING_EXPRESSION, privateClassName));

	this.cacheable && this.cacheable(true);
	this.callback(null, output, sourceMaps);
};