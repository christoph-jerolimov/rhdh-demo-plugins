# RHDH demo plugins

## How this repo is created

### 1. Basics from Backstage Community Plugins repo

This demo project is manually created inspired by the "new workspace" process of the Backstage Community Plugins repository.

The Backstage Community Plugins repo `new-workspace` command runs `npx @backstage/create-app@latest --path ${workspacePath} --skip-install --template-path=${templatePath}` internally, where template path is the local copy of https://github.com/backstage/community-plugins/tree/main/workspaces/repo-tools/packages/cli/src/lib/workspaces/templates/workspace.

For this demo I manually copied, modified or skipped these files:

- backstage.json.hbs - copied and added the right Backstage version (1.49) for RHDH 1.10.
- bcp.json.hbs - skipped because this repo will not use the same GitHub workflows
- .dockerignore - skipped because this repo will not build a container image (this way) via docker
- .eslintignore - copied
- .eslintrc.js.hbs - skipped because it loads a another eslintrc from the repo root but this project will not use multiple workspaces
- .gitignore.hbs - copied (as initial version)
- package.json.hbs - copied - need to change the included version for Backstage 1.49
- .prettierignore - copied
- README.md.hbs - skipped
- tsconfig.json - copied
- yarn.lock - copied

### 2. Created scripts to enforce dependencies

```shell
node ./scripts/set-backstage-dependencies.mjs
node ./scripts/pin-backstage-versions.mjs
```

### 3. Created a scaffolder todo frontend and backend plugin

Created both plugins with `yarn new`. Both failed with:

```
Warning: Failed to execute command 'yarn lint --fix', ExitCodeError: Command 'yarn lint --fix' exited with code 1
```

Removed the plugins, installed this dev dependencies to resolve that problem and verified this by recreating the plugins.

```shell
yarn add -W --dev jest@^30.3.0 @jest/environment-jsdom-abstract@^30.3.0 @types/jest@^30.0.0
```

After that added missing dev dependencies

```shell
yarn --cwd plugins/todo add --dev react@^18 react-dom@^18 react-router-dom@^7.14.1
```
