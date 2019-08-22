const csstree = require('css-tree');

const { createDirHash } = require('./utils/dirhash');

module.exports = function styleLoader (source) {
	const { globalsPrefix = 'app' } = this.query;
	const [dirName, dirHash] = createDirHash(this.context);
	const ast = csstree.parse(source);

	csstree.walk(ast, {
		visit: 'ClassSelector',
		enter (node) {
			const className = node.name;

			if (className.startsWith(globalsPrefix)) return;
			node.name = `${dirName}-${dirHash}-${className}`;
		}
	});

	return csstree.generate(ast, {
		sourceMap: false // if true, returns object instead of string
	});
};