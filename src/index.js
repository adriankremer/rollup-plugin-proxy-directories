const {
  writeFileSync,
  mkdirSync,
  readFileSync,
  createWriteStream,
  existsSync,
} = require('fs');

const populateIgnoreFile = (fileName, modules) => {
  const ignoreFile = existsSync(fileName) && readFileSync(fileName, "utf-8");
  const stream = createWriteStream(fileName, { flags: 'a' });
  if (!ignoreFile) {
    process.stdout.write(`💎 \x1b[35mCreating '${fileName}' with proxy directories.\x1b[0m\r\n`)
  } else {
    process.stdout.write(`💈 \x1b[35mUpdating '${fileName}' with proxy directories.\x1b[0m\r\n`);
  }
  modules.forEach(([module]) => {
    if (!ignoreFile || ignoreFile.indexOf(module) < 0) {
      stream.write(`${module}\r\n`);
    }
  });
  stream.end();
};

export default function proxyDirectories(options = {}) {
  const { packageName, files, ignoreFile } = options;
  let proxiesGenerated = false;
  return {
    name: 'proxy-directories',

    writeBundle() {
      if (!proxiesGenerated) {
        const createProxyPackage = module => `{
          "name": "${packageName}/${module}",
          "private": true,
          "main": "../lib/${module}",
          "module": "../es/${module}",
          "types": "../ts/${module}"
        }`;

        const createDirPackage = dir => `{
          "name": "${packageName}/${dir}",
          "private": true,
          "types": "../ts"
        }`;

        const modules = Object.entries(files)
          .filter(([module]) => module !== 'index');

        modules.forEach(([module]) => {
          mkdirSync(module);
          writeFileSync(`${module}/package.json`, createProxyPackage(module));
        });

        ['lib', 'es'].forEach(dir => {
          writeFileSync(`${dir}/package.json`, createDirPackage(dir));
        });

        ignoreFile && populateIgnoreFile(".gitignore", modules);

        proxiesGenerated = true;
      }
    }
  };
}
