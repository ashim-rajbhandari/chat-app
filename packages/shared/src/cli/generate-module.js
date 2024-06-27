const path = require('path');
const fs = require('fs');
const colors = require('colors/safe');
const config = require('./config');
const generateModule = require('./handler/module');

colors.enable();

((args) => {
  try {
    const appArg = args[2];
    const nameArg = args[3];

    if (!appArg?.includes('app=')) {
      throw Error('Please provide app parameter. eg: app=cms');
    }

    const configedApps = config['apps'];
    const appName = configedApps[appArg.split('=')[1]];

    if (!appName) {
      throw Error(
        `Please provide valid app alias names: ${Object.keys(configedApps).join(
          ', '
        )}`
      );
    }

    if (!nameArg?.includes('name=')) {
      throw Error('Please provide module name parameter. eg: name=admin');
    }
    const moduleName = nameArg.split('=')[1];

    const appPath = path.resolve(__dirname, `../../../../apps/${appName}`);
    const modulePath = path.resolve(
      __dirname,
      `../../../../apps/${appName}/src/modules/${moduleName}`
    );
    if (!fs.existsSync(appPath)) {
      throw Error(`${appName} doesn't exists on apps directory.`);
    }

    if (fs.existsSync(modulePath)) {
      throw Error(`${moduleName} module already exists.`);
    }
    console.log(colors.magenta('===: ...generating'));
    generateModule(modulePath, moduleName, appName);
    console.log(colors.green(`===: ${moduleName} module generated`));
  } catch (error) {
    console.log(colors.red(`(×) ===: ${error.message}`));
  }
})(process.argv);
