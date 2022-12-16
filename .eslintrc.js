module.exports = {
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	root: true,
	ignorePatterns: ['.eslintrc.js'],
	rules: {
        "@typescript-eslint/no-unused-vars": ['warn', {
			argsIgnorePattern: '^_',
			varsIgnorePattern: '^_'
		}],
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-var-requires": "off",
    }
};