let atomspaceEslint = require('@atomspace/eslint')

module.exports = {
   use: [
      atomspaceEslint({
         eslint: {
				env: {node: true}
         }
      })
   ]
}