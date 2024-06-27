const fs = require('fs');

const {
  cmsModuleDefaultFolders,
  apiModuleDefaultFolders
} = require('../config');

module.exports = (modulePath, moduleName, appName) => {
  const isApiModule = moduleName.includes('api') || appName.includes('api');
  const defaultFolders = isApiModule
    ? apiModuleDefaultFolders
    : cmsModuleDefaultFolders;

  fs.mkdirSync(modulePath);

  for (const folder of defaultFolders) {
    const folderPath = `${modulePath}/${folder}`;
    fs.mkdirSync(folderPath);
    const { init } = require(`../generaters/${folder}`);
    init({
      folderPath,
      moduleName,
      isApiModule
    });
  }
};
