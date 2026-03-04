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
  // Commit URL pattern for GitHub links in the changelog
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
};
