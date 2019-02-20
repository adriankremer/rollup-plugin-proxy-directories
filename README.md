# rollup-plugin-proxy-directories

creates proxy directories for libraries without configuration to make direct imports easier.

## Example
**Source**
```
├── Button
│   ├── Button.tsx
│   ├── ButtonHook.tsx
│   └── index.ts
├── index.ts
```

**Build**
```
├── Button
│   ├── ButtonHooks
│   │   └── package.json
│   └── package.json
├── es
│   ├── Button
│   │   ├── ButtonHooks.js
│   │   └── index.js
│   ├── index.js
├── lib
│   ├── Button
│   │   ├── ButtonHooks.js
│   │   └── index.js
│   ├── index.js
```

**Usage**
```js
import Button from 'ui-library/button';
import ButtonHook from 'ui-library/button/buttonHook';
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
    proxyDirectories()
  ]
};
```

## todos (please contribute)

* write tests :)


## License

MIT
