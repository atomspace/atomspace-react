const { createDirHash } = require('./utils/dirhash');

module.exports = function scriptLoader (source) {
	const { globalsPrefix = 'app' } = this.query;
	const CLASS_EXPR = /classname:\s(["'].*?["']|.*?\))/gi;
	const classStringRegex = new RegExp(`['|"](.*?)['|"]`, 'g');

	if (!source.match(CLASS_EXPR)) {
		return source;
	}
	const [dirName, dirHash] = createDirHash(this.context);

	return source.replace(CLASS_EXPR, classExpr => {
		return classExpr.replace(classStringRegex, (_match, classNames) => {
			const uniqueClassNames = classNames.split(' ')
				.filter(Boolean)
				.map(className => {
					const containsPrefix = className.startsWith(`${globalsPrefix}-`);
					const uniqueClassName = `${dirName}-${dirHash}-${className}`;

					return containsPrefix ? className : uniqueClassName;
				})
				.join(' ');

			return `'${uniqueClassNames}'`;
		});
	});
};