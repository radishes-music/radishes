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

### remove deps
```
  "@babel/core": "^7.11.6",
  "@babel/plugin-proposal-optional-chaining": "^7.16.7",
  "babel-loader": "^8.1.0",
  "less-loader": "^5.0.0",
  "ts-loader": "^8.0.6",
  "url-loader": "^4.1.1",
  "vue-loader": "^16.1.2",
  "core-js": "^3.6.5",
  "@vue/cli-plugin-eslint": "~4.5.0",
  "@vue/cli-plugin-router": "~4.5.0",
  "@vue/cli-plugin-typescript": "~4.5.0",
  "@vue/cli-plugin-unit-mocha": "~4.5.0",
  "@vue/cli-plugin-vuex": "~4.5.0",
  "@vue/cli-service": "~4.5.0",
  "webpack-bundle-analyzer": "4.3.0"
  "vue-cli-plugin-electron-builder": "^2.1.1",
  "@vue/compiler-sfc": "^3.0.5",
  "babel-plugin-import": "^1.13.1",
  "@vue/babel-plugin-jsx": "^1.0.3",
```

### Version Conflict

lerna is not compatible with yarn@3

```
[ERROR INFO]
lerna ERR! yarn install --mutex network:42424 --non-interactive exited 1 in 'radishes'

[Bad Solution]
Use yarn@1 to run lerna, and then use yarn@3 to manage project dependencies.😂
```

### HMR not working
[OFFICE](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx#hmr-detection)
```
Only support component by export with called render of defineComponent
```

### install extension error
[ISSUE](https://github.com/MarshallOfSound/electron-devtools-installer/pull/177#issuecomment-914813869)
```
So update electron deps latest
```