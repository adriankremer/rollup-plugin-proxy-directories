const {
  writeFileSync,
  readFileSync,
  createWriteStream,
  existsSync,
  ensureDirSync,
  readdirSync,
  lstatSync } = require('fs-extra');
const { join, dirname } = require('path');
const rimraf = require('rimraf');
const cwd = process.cwd();
const chalk = require('chalk');


function message(message, cssColor, bold) {
  process.stdout.write(
    bold ? chalk.bold.keyword(cssColor)(message + '\r\n') : chalk.keyword(cssColor)(message + '\r\n')
  );
}

function populateIgnoreFile(rootPath, fileName) {
  const buildFolders = getBuildFolders(rootPath);
  const ignoreFile = existsSync(fileName) && readFileSync(fileName, 'utf-8');
  const stream = createWriteStream(fileName, { flags: 'a' });
  message(`\r\n💾  ${ignoreFile ? 'Updating' : 'Creating'} '${fileName}' with proxy directories.\r\n`, 'salmon');
  buildFolders
    .filter(name => !/\//.test(name))
    .forEach((folder) => {
      if (!ignoreFile || ignoreFile.indexOf(folder) < 0) {
        stream.write(`/${folder}/\r\n`);
      }
    });
  stream.end();
}

function resolveDir(dir) {
  if (!/\.(t|j)s$/.test(dir)) {
    return dir;
  }
  return dirname(dir);
}

function getPackage(rootPath) {
  return require(join(rootPath, "package.json"));
}

function getBuildDir(rootPath, type) {
  const pkg = getPackage(rootPath);
  try {
    return resolveDir(pkg[type]);
  } catch (e) {
    return false;
  }
}

function removeExt(path) {
  return path.replace(/\.[^.]+$/, "");
}

function isPublicModule(path) {
  return !/^_/.test(path);
}

function isDirectory(path) {
  return lstatSync(path).isDirectory();
}

function isDirectoryName(path, fileName) {
  const splittedPath = path.split("/");
  const folderName = splittedPath[splittedPath.length - 2];
  return folderName === removeExt(fileName);
}

function getSourcePath(rootPath) {
  return join(rootPath, "src");
}

function getProxyPackageContents(rootPath, moduleName) {
  const { name } = getPackage(rootPath);
  const mainDir = getBuildDir(rootPath, 'main');
  const moduleDir = getBuildDir(rootPath, 'module');
  const typesDir = getBuildDir(rootPath, 'types') || getBuildDir(rootPath, 'typings');
  const prefix = "../".repeat(moduleName.split("/").length);
  const packageJson = Object.assign(
    {
      name: `${name}/${moduleName}`,
      private: true,
    },
    mainDir ? { main: join(prefix, mainDir, moduleName) } : {},
    moduleDir ? { module: join(prefix, moduleDir, moduleName) } : {},
    typesDir ? { types: join(prefix, typesDir, moduleName) } : {}
  );
  return JSON.stringify(packageJson, null, 2);
}

function getPublicFiles(rootPath, prefix = "") {
  return readdirSync(rootPath)
    .filter(isPublicModule)
    .reduce((acc, filename) => {
      const path = join(rootPath, filename);
      const childFiles = isDirectory(path) && getPublicFiles(path, filename);
      return Object.assign(
        childFiles || !isDirectoryName(path, filename) && { [ removeExt(join(prefix, filename))]: path },
        acc,
      );
    }, {});
}

function getProxyFolders(rootPath) {
  const publicFiles = getPublicFiles(getSourcePath(rootPath));
  return Object.keys(publicFiles)
    .map(name => name.replace(/\/index$/, ""))
    .filter(name => name !== "index");
}

function getBuildFolders(rootPath) {
  return [
    getBuildDir(rootPath, 'main'),
    getBuildDir(rootPath, 'unpkg'),
    getBuildDir(rootPath, 'module'),
    ...getProxyFolders(rootPath),
  ].filter(Boolean);
}

function cleanBuild(rootPath) {
  message(`\r\n🚽  Cleaning ${rootPath}`, 'salmon');
  return getBuildFolders(rootPath)
    .filter(name => !/\//.test(name))
    .forEach(name => {
      try {
        rimraf.sync(name);
        message(`- cleaned ${name}`, 'gray');
      } catch (e) {
        message(`Couldn't clean ${name}`, 'red');
      }
    });
}

function makeProxies(rootPath) {
  message(`\r\n🎁  Making proxies in ${rootPath}`, 'salmon');
  return getProxyFolders(rootPath).forEach(name => {
    ensureDirSync(name);
    writeFileSync(
      `${name}/package.json`,
      getProxyPackageContents(rootPath, name)
    );
    message(`- created ${name}`, 'gray');
  });
}

export default function proxyDirectories() {
  return {
    name: 'proxy-directories',

    buildStart(options) {
      options.input = getPublicFiles(getSourcePath(cwd));
      cleanBuild(cwd);
      makeProxies(cwd);
      populateIgnoreFile(cwd, '.gitignore');
    }
  };
}
