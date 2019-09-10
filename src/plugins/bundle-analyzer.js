let { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function BundleAnalyzer ({ config }) {
	let prodMode = process.env.NODE_ENV === 'production';

	config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [{
		analyzerMode: prodMode ? 'static' : 'server',
		analyzerHost: 'localhost',
		analyzerPort: 'auto',
		reportFilename: 'bundle-report.html',
		defaultSizes: 'parsed',
		openAnalyzer: false,
		generateStatsFile: false,
		statsFilename: 'stats.json',
		statsOptions: null,
		excludeAssets (assetName) {
			const HMR_PATCH_EXP = /hot-update\.js$/;

			return HMR_PATCH_EXP.test(assetName);
		},
		logLevel: 'info' // info, warn, error, silent
	}]);
};