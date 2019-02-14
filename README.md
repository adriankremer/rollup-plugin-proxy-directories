# rollup-plugin-proxy-directories

creates proxy directories for libraries ..see [how-to-create-javascript-libraries-in-2018](https://developers.livechatinc.com/blog/how-to-create-javascript-libraries-in-2018-part-2/)

## Installation

```bash
npm install --save-dev rollup-plugin-proxy-directories
```

## Usage

```js
// rollup.config.js
import proxyDirectories from 'rollup-plugin-proxy-directories';
import pkg from './package.json';

export default {
  // ...
  plugins: [
    proxyDirectories({
      packageName: pkg.name,
      files: {
        moduleName: 'path/to/module'
      }
    })
  ]
};
```

## Options

```js
{
  // the name of the library
  // this will result in the proxy packages e.g. packageName/module
  packageName: 'name-of-the-library',

  // files object which represent modules you want to proxy
  files: {
    moduleName: "path/to/module",
  }
}
```

## todos

* add console messages like "generating proxy-directories"
* write tests :)


## License

MIT
