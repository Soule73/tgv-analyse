// commitlint.config.cjs
// Enforces the Conventional Commits specification.
// See: https://www.conventionalcommits.org
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat', // A new feature
        'fix', // A bug fix
        'docs', // Documentation changes only
        'style', // Code style / formatting (no logic change)
        'refactor', // Code restructuring (no feature / bug)
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'build', // Build system or CI changes
        'ci', // CI configuration changes
        'chore', // Maintenance tasks (deps, tooling…)
        'revert', // Reverting a previous commit
      ],
    ],
    // Subject must start with a lowercase letter
    'subject-case': [2, 'always', 'lower-case'],
    // Subject must not end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Type must be in lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Limit header length to 100 characters
    'header-max-length': [2, 'always', 100],
    // Body lines limited to 120 characters
    'body-max-line-length': [2, 'always', 120],
  },
};
