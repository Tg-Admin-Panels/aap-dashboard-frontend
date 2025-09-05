# Commit Message Guide for Versioning

This project uses semantic versioning with automatic version updates based on commit messages. Following this guide will ensure proper version increments and changelog generation.

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types and Their Effects on Versioning

### Major Version Bump (X.0.0)
- `BREAKING CHANGE:` in commit body or footer
- Example:
  ```
  feat: update authentication system

  BREAKING CHANGE: new auth system requires different login flow
  ```

### Minor Version Bump (0.X.0)
- `feat:` - New feature
- Examples:
  ```
  feat: add dark mode support
  feat(dashboard): add new analytics widgets
  feat(auth): implement SSO login
  ```

### Patch Version Bump (0.0.X)
- `fix:` - Bug fixes
- `perf:` - Performance improvements
- Examples:
  ```
  fix: resolve login error on Safari
  fix(api): handle timeout errors properly
  perf: optimize image loading
  ```

### No Version Bump
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks
- Examples:
  ```
  docs: update README installation steps
  style: format code using prettier
  refactor: reorganize component structure
  test: add unit tests for auth module
  chore: update dependencies
  ```

## Scope (Optional)

The scope provides context about what part of the codebase is affected:
- `(auth)`
- `(api)`
- `(ui)`
- `(dashboard)`
- `(deps)`

## Best Practices

1. **Be Specific**
   - ✅ `fix(auth): handle expired token refresh`
   - ❌ `fix: bug fixes`

2. **Use Present Tense**
   - ✅ `feat: add user settings page`
   - ❌ `feat: added user settings page`

3. **Keep it Concise**
   - ✅ `feat(ui): implement responsive navigation`
   - ❌ `feat(ui): implement responsive navigation bar with hamburger menu that opens and closes on click and supports both desktop and mobile views`

4. **Breaking Changes**
   - Always capitalize `BREAKING CHANGE:`
   - Put it in the footer
   - Explain what breaks and how to migrate

## Examples of Complete Commit Messages

### Feature with Breaking Change
```
feat(auth): implement OAuth2 authentication

- Add OAuth2 client implementation
- Update login flow
- Add token management

BREAKING CHANGE: Users need to re-authenticate and update their client implementation
```

### Bug Fix
```
fix(api): resolve data inconsistency

- Add validation for empty responses
- Implement retry mechanism
- Update error handling
```

### Documentation Update
```
docs: update deployment guide

- Add AWS deployment steps
- Update environment variables table
- Add troubleshooting section
```

## Commands for Versioning

After committing with proper messages, use these commands to update versions:

```bash
# Automatic version bump based on commits
npm run release

# Manual version bumps
npm run release:major  # For breaking changes (1.0.0 -> 2.0.0)
npm run release:minor  # For new features (1.1.0 -> 1.2.0)
npm run release:patch  # For bug fixes (1.1.1 -> 1.1.2)
```

## Checking the Version

- The current version is displayed at the bottom of the application
- Hover over the version number to see the latest commit message
- Check package.json for the current version number
- View CHANGELOG.md for a history of changes
