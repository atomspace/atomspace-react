let webpackDevServerWaitpage = require('webpack-dev-server-waitpage');

module.exports = function (serverSettings = {}) {
	return function (neutrino) {
		neutrino.config
			.devServer.merge({
				open: serverSettings.open,
				before (app, server) {
					app.use(webpackDevServerWaitpage(server, {
						title: serverSettings.title,
						theme: 'dark',
						disableWhenValid: true
					}));
				}

				// onListening (server) {}
			});
	};
};