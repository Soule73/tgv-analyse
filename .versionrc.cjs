// .versionrc.cjs
// Configuration for standard-version (changelog sections).
// Maps Conventional Commit types to changelog headings.
module.exports = {
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'perf', section: 'Performance Improvements' },
    { type: 'refactor', section: 'Code Refactoring' },
    { type: 'docs', section: 'Documentation', hidden: false },
    { type: 'build', section: 'Build System', hidden: false },
    { type: 'ci', section: 'CI/CD', hidden: false },
    { type: 'test', section: 'Tests', hidden: true },
    { type: 'chore', section: 'Chores', hidden: true },
    { type: 'style', hidden: true },
    { type: 'revert', section: 'Reverts' },
  ],
  // GitHub repository links in the changelog
  host: 'https://github.com',
  owner: 'Soule73',
  repository: 'tgv-analyse',
  commitUrlFormat: 'https://github.com/Soule73/tgv-analyse/commit/{{hash}}',
  compareUrlFormat:
    'https://github.com/Soule73/tgv-analyse/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: 'https://github.com/Soule73/tgv-analyse/issues/{{id}}',
  userUrlFormat: 'https://github.com/{{user}}',
};
