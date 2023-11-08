# Migrate build tool

### use vite in scripts

- remove "inspect": "vue-cli-service inspect",

- serve web with vite

### use yarn@3

```sh
# need run
corepack enable
# then will auto use @3
yarn
```

### error

- use vite build with run rollup will conflict with `js-base64` -> var VERSION
  so rename `VERSION` -> `__APP_VERSION__`

### Version Conflict

lerna is not compatible with yarn@3

```
[ERROR INFO]
lerna ERR! yarn install --mutex network:42424 --non-interactive exited 1 in 'radishes'

[Bad Solution]
Use yarn@1 to run lerna, and then use yarn@3 to manage project dependencies.😂
```
