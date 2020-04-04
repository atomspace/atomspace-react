let csstree = require('css-tree');

let { createDirHash } = require('./utils/dirhash');

module.exports = function styleLoader (source/* , sourceMaps */) {
	let { globalsPrefix = 'app' } = this.query;
	let [dirName, dirHash] = createDirHash(this.context);
	let filename = this.resourcePath;
	let ast = csstree.parse(source, {
		filename,
		positions: true
	});
	let sourceMap = this.sourceMap;
	let css;
	let map;

	csstree.walk(ast, {
		visit: 'ClassSelector',
		enter (node) {
			let className = node.name;

			if (className.startsWith(globalsPrefix)) return;
			node.name = `${dirName}-${dirHash}-${className}`;
		}
	});

	let compiledResult = csstree.generate(ast, {
		sourceMap // if true, returns object instead of string
	});

	if (typeof compiledResult === 'object') {
		css = compiledResult.css;
		map = compiledResult.map.toJSON();
		map.sourcesContent = [source];
	}
	else {
		css = compiledResult;
	}

	this.cacheable && this.cacheable(true);
	this.callback(null, css, map);
};