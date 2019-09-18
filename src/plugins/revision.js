let GitRevisionPlugin = require('git-revision-webpack-plugin');
let { DefinePlugin } = require('webpack');

module.exports = function Revision (neutrino) {
	let { config, options } = neutrino;
	let { version } = options.packageJson;
	let revisionOptions = {
		lightweightTags: true,
		branch: true
	};
	let VERSION;
	let COMMITHASH;
	let BRANCH;

	try {
		let gitRevisionPlugin = new GitRevisionPlugin(revisionOptions);

		VERSION = gitRevisionPlugin.version();
		COMMITHASH = gitRevisionPlugin.commithash();
		BRANCH = gitRevisionPlugin.branch();
	}
	catch (err) {
		VERSION = version;
		COMMITHASH = '';
		BRANCH = '';
	}

	config
		.plugin('revision')
			.use(GitRevisionPlugin, [revisionOptions])
			.end()
		.plugin('revision-vars')
			.use(DefinePlugin, [{
				'process.env.VERSION': JSON.stringify(VERSION),
				'process.env.COMMITHASH': JSON.stringify(COMMITHASH),
				'process.env.BRANCH': JSON.stringify(BRANCH)
			}])
			.end();
};