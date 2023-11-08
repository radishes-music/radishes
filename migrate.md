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
# deprecated yarn.lock, recommend use .yarn folder
```

### error

```
use vite build with run rollup will confuse conflict with
js-base64 -> var VERSION
so rename VERSION -> __APP_VERSION__
```
