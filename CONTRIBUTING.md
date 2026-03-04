# Contributing to TGV Analyse

Thank you for your interest in contributing! Please follow this guide to keep
the project consistent and the history readable.

---

## Commit convention

This project enforces the **[Conventional Commits](https://www.conventionalcommits.org/)** specification via `commitlint` and `Husky`.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Allowed types

| Type       | When to use                                       |
| ---------- | ------------------------------------------------- |
| `feat`     | A new feature                                     |
| `fix`      | A bug fix                                         |
| `docs`     | Documentation changes only                        |
| `style`    | Formatting, missing semicolons… (no logic change) |
| `refactor` | Code restructuring (no feature / bug)             |
| `perf`     | Performance improvements                          |
| `test`     | Adding or updating tests                          |
| `build`    | Build system, Docker, dependencies                |
| `ci`       | CI/CD configuration                               |
| `chore`    | Maintenance tasks (tooling, scripts…)             |
| `revert`   | Reverting a previous commit                       |

### Scopes (optional)

Use the service name as scope when applicable: `api`, `dashboard`, `simulator`.

### Examples

```bash
# Good
feat(api): add pagination to /api/tgv endpoint
fix(dashboard): correct punctuality gauge colour stops
docs: update getting started section in readme
chore: bump eslint to v9

# Bad — will be rejected by commitlint
Update stuff
fixed bug
WIP
```

### Rules enforced

- Subject must start with a **lowercase** letter.
- Subject must **not** end with a period.
- Header length ≤ **100** characters.
- Body lines ≤ **120** characters.

---

## Workflow

1. **Fork** the repository and create a feature branch:

   ```bash
   git checkout -b feat/my-feature
   ```

2. Make your changes, ensuring code is **formatted** and **linted**:

   ```bash
   npm run format
   npm run lint
   ```

3. **Commit** following the convention above. The `pre-commit` hook will run
   Prettier + ESLint automatically via `lint-staged`. The `commit-msg` hook will
   validate your message with `commitlint`.

4. **Push** your branch and open a **Pull Request** against `master`.

---

## Release process (maintainers only)

Releases are managed with `standard-version`. The CHANGELOG is generated
automatically from commit messages.

```bash
# Patch release (bug fixes)
npm run release:patch

# Minor release (new features)
npm run release:minor

# Major release (breaking changes)
npm run release:major

# Push commits + tag
git push --follow-tags origin master
```

---

## Code style

- **JavaScript / TypeScript**: ESLint + Prettier (see `eslint.config.js` and `.prettierrc`)
- **Python**: standard library style, type hints required on all functions
- Comments and documentation must be written in **English**
