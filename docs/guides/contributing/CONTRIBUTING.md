# Contributing Guide

Thank you for contributing to DeliveryApp! Please read this before opening a PR.

---

## Branching Strategy

We use **GitHub Flow**:

```
main          ← production-ready code only
  └── dev     ← integration branch (PRs merge here first)
        └── feature/your-feature-name
        └── fix/bug-description
        └── chore/task-description
```

| Branch Prefix | When to Use                         |
|---------------|-------------------------------------|
| `feature/`    | New feature or screen               |
| `fix/`        | Bug fix                             |
| `chore/`      | Tooling, config, refactoring        |
| `docs/`       | Documentation only                  |
| `hotfix/`     | Urgent production fix               |

---

## Commit Message Convention

We follow **Conventional Commits**:

```
<type>(scope): short description

[optional body]
[optional footer]
```

Examples:
```
feat(orders): add order detail screen
fix(api): handle 401 token refresh correctly
chore(deps): upgrade react-navigation to v6.5
docs(api): document /delivery endpoints
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

---

## Pull Request Checklist

Before requesting a review, ensure:

- [ ] Code compiles without errors or warnings
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run test` passes with no regressions
- [ ] New components have a `README.md` with usage examples
- [ ] New API endpoints are documented in `docs/api/API_REFERENCE.md`
- [ ] PR description explains **what** and **why**, not just **how**
- [ ] Linked to the relevant GitHub Issue (if applicable)

---

## Code Style

- **TypeScript strict mode** — no `any` unless justified with a comment
- **Prettier** for formatting — runs automatically on save (configure your editor)
- **ESLint** — fix all warnings before committing
- **Named exports** — avoid default exports except for screens
- **No magic numbers** — use `src/constants/` or `src/theme/`
