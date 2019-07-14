module.exports = {
	use: [
		['@atomspace/eslint', {
			eslint: {
				env: {
					node: true,
					browser: true
				}
			}
		}]
	]
}