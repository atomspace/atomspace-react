module.exports = function () {
	return function (neutrino) {
		let projectPath = process.cwd();
		let environmentIsPnP = Boolean(process.versions.pnp);
		let moduleAlias = require('module-alias');

		if (environmentIsPnP) {
			// solve the issue with the linked middleware outside of the project root
			moduleAlias.addAlias('pnpapi', require.resolve('pnpapi', { paths: [projectPath] }));
		}

		let PnpWebpackPlugin = require(`pnp-webpack-plugin`);

		function PnpPlugin () {
			return PnpWebpackPlugin;
		}
		function PnpLoaderPlugin () {
			return PnpWebpackPlugin.moduleLoader(projectPath);
		}

		neutrino.config
			.resolve
				.plugin('pnp')
					.use(PnpPlugin)
					.end()
				.end()
			.resolveLoader
				.plugin('pnp')
					.use(PnpLoaderPlugin)
					.end()
				.end();
	};
};