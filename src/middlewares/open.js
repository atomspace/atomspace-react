let webpackDevServerWaitpage = require('webpack-dev-server-waitpage');

module.exports = function () {
	return function (neutrino) {
		neutrino.config
			.devServer.merge({
				open: true,
				before (app, server) {
					app.use(webpackDevServerWaitpage(server, {
						title: neutrino.config.get('name'),
						theme: 'dark',
						disableWhenValid: true
					}));
				}

				// onListening (server) {}
			});
	};
};