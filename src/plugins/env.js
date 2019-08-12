const { EnvironmentPlugin } = require('webpack');

module.exports = function ({ config }) {
	let envVariables = Object.keys(process.env);

	config.plugin('env').use(EnvironmentPlugin, envVariables);
};