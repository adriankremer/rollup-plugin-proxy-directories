const { writeFileSync, mkdirSync } = require('fs');

export default function proxyDirectories(options = {}) {
  const { packageName, files } = options;
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

        Object.entries(files)
          .filter(([module]) => module !== 'index')
          .forEach(([module]) => {
            mkdirSync(module);
            writeFileSync(`${module}/package.json`, createProxyPackage(module));
          });

        ['lib', 'es'].forEach(dir => {
          writeFileSync(`${dir}/package.json`, createDirPackage(dir));
        });
        proxiesGenerated = true;
      }
    }
  };
}
