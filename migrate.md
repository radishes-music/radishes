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
