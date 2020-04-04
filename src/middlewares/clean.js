let clean = require('@neutrinojs/clean');

module.exports = function () {
	return function (neutrino) {
		let prodMode = neutrino.config.get('mode') !== 'development';

		if (prodMode) {
			neutrino.use(clean());
		}
	};
};