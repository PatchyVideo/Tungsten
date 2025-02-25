# Contributing to PatchyVideo/Tungsten

## Repo Setup

Please note that in order to launch this repo, you'll need to install Node.js >=v20.

This repo is using [pnpm](https://pnpm.io/) for package menagement,
make sure to use pnpm while installing and linking dependencies.

We recommend using [Visual Studio Code](https://code.visualstudio.com/) for code editing.
Be sure to install recommended extensions.

For testing GraphQL, head on to <https://patchyvideo.com/be/gql/graphiql>.

### Commands

```bash
# clone the repo
$ gh repo clone PatchyVideo/Tungsten # or `git clone https://github.com/PatchyVideo/Tungsten`
$ cd Tungsten

# install dependencies
$ pnpm i

# codegen
$ pnpm codegen

# lint & format
$ pnpm lint:fix

# launch nuxt dev server
$ pnpm dev

# build nuxt server
$ pnpm build
```
