# rollup-plugin-proxy-directories

creates proxy directories for libraries to make direct imports easier.

## Example
```js
import Button from 'ui-library/button';
```
inspired by this article: [how-to-create-javascript-libraries-in-2018](https://developers.livechatinc.com/blog/how-to-create-javascript-libraries-in-2018-part-2/)

## Installation

```bash
npm install --save-dev rollup-plugin-proxy-directories
```

## Usage

```js
// rollup.config.js
import proxyDirectories from "rollup-plugin-proxy-directories";
import pkg from "./package.json";

export default {
  // ...
  plugins: [
    proxyDirectories({
      packageName: pkg.name,
      files: {
        button: "src/Button/index.ts"
      },
      gitIgnore: true,
    })
  ]
};
```

## Options

```js
{
  // the name of the library
  // this will result in the proxy packages e.g. packageName/module
  packageName: "name-of-the-library",

  // files object which represent modules you want to proxy
  files: {
    moduleName: "path/to/module",
  }

  // generates or poulates a .gitignore file for the generated proxy-directories
  ignoreFile: true,
}
```

## todos

* add console messages like "generating proxy-directories"
* write tests :)


## License

MIT
