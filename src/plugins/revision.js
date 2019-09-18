let GitRevisionPlugin = require('git-revision-webpack-plugin');
let { DefinePlugin } = require('webpack');

let revisionOptions = {
	lightweightTags: true,
	branch: true
};
let gitRevisionPlugin = new GitRevisionPlugin(revisionOptions);
let VERSION = gitRevisionPlugin.version();
let COMMITHASH = gitRevisionPlugin.commithash();
let BRANCH = gitRevisionPlugin.branch();

module.exports = function Revision ({ config }) {
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