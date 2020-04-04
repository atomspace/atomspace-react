const path = require('path');
const crypto = require('crypto');

module.exports.createDirHash = function createDirHash (filePath) {
	const LENGTH = 10;
	const { dir: dirPath, name: dirName } = path.parse(filePath);
	const dirHash = crypto
		.createHash('md5')
		.update(dirPath)
		.digest('hex')
		.slice(0, LENGTH);

	return [dirName, dirHash];
};