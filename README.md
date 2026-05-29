# RHDH Demo Plugins

A Backstage plugin workspace demonstrating production-grade tooling for building [Red Hat Developer Hub](https://developers.redhat.com/rhdh) (RHDH) plugins. It includes a sample **todo** plugin (frontend + backend) along with a full suite of build, test, lint, and CI/CD infrastructure.

Based on the Backstage Community Plugins [workspace template](https://github.com/backstage/community-plugins/tree/main/workspaces/repo-tools/packages/cli/src/lib/workspaces/templates/workspace), and the scaffolder templates for frontend and backend plugins.

It is adapted for a standalone plugin repository.

## Plugins

| Plugin | Role | Description |
| --- | --- | --- |
| `plugins/todo` | Frontend | UI for displaying todo items, built with `@backstage/frontend-plugin-api` and `@backstage/ui` |
| `plugins/todo-backend` | Backend | REST API for todo items using Express, with Zod request validation |

## Tooling

### TypeScript

- **TypeScript** with strict settings via `@backstage/cli/config/tsconfig.json`
- `yarn tsc:full` — full type-check without incremental caching (used in CI)

### Build

- **Backstage CLI** handles all package builds while **RHDH cli** builds container images
- `yarn build:all` — builds all plugins in the workspace
- `yarn build:api-reports` — generates and validates API reports using `@backstage/repo-tools`

### Testing

- **Jest** with jsdom environment
- Frontend tests use `@testing-library/react` and `msw` for mocking
- Backend tests use `supertest` and `@backstage/backend-test-utils`
- `yarn test` — run tests for changed packages
- `yarn test:all` — run all tests with coverage

### Linting

- **ESLint** via `@backstage/cli/config/eslint-factory` (per-plugin `.eslintrc.js`)
- `yarn lint` — lint changed files since `origin/main`
- `yarn lint:all` — lint the entire workspace

### Formatting

- **Prettier** using the Backstage shared config (`@backstage/cli/config/prettier`)
- **lint-staged** runs ESLint + Prettier on pre-commit for staged files
- `yarn prettier:check` — verify formatting
- `yarn prettier:fix` — auto-format all files

### Dead Code Detection

- **Knip** finds unused dependencies, exports, and files
- `yarn build:knip-reports` — generates per-plugin knip reports

### Deprecation Tracking

- `yarn list-deprecations` — lists usage of deprecated Backstage APIs across the workspace

## Version Pinning

Two scripts in `scripts/` keep Backstage dependency versions aligned with a specific Backstage release (configured in `backstage.json`):

- `set-backstage-dependencies.mjs` — updates `@backstage/*` dependency ranges in all `package.json` files to match the release manifest
- `pin-backstage-versions.mjs` — pins exact versions in the root `resolutions` field to prevent accidental upgrades beyond what RHDH ships

## CI / GitHub Actions

The [CI workflow](.github/workflows/ci.yaml) runs on pushes and PRs to `main`.

Runs always a complete build, lint, verify formatting, deprecation check and tests with coverage cycle.

On merge to `main`, it also builds and pushes OCI plugin container images to `ghcr.io` using RHDH cli and Podman.

## Using these Plugins in RHDH

Container image with all plugins:

```yaml
plugins:
  - package: oci://ghcr.io/christoph-jerolimov/rhdh-demo-plugins!internal-backstage-plugin-todo
    disabled: false
  - package: oci://ghcr.io/christoph-jerolimov/rhdh-demo-plugins!internal-backstage-plugin-todo-backend
    disabled: false
```

Individual plugin images:

```yaml
plugins:
  - package: oci://ghcr.io/christoph-jerolimov/rhdh-todo-demo-plugin
    disabled: false
  - package: oci://ghcr.io/christoph-jerolimov/rhdh-todo-backend-demo-plugin
    disabled: false
```
