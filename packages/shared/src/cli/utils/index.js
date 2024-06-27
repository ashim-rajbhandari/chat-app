const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');
const _ = require('lodash');
const pluralize = require('pluralize');
const { cms, api } = require('../config');

module.exports = {
  extractOnlyName: (moduleName) => {
    return moduleName.includes('/') ? moduleName.split('/')[1] : moduleName;
  },

  extractTableName: (migrationName) => {
    let tableName = migrationName.split('-')[1];
    return tableName.includes('.js') ? tableName.replace('.js', '') : tableName;
  },

  getDbModelName: (tableName) => {
    const name = _.camelCase(tableName);
    return pluralize.singular(name);
  },

  getFileName: (extractedName, fileType, isApiModule) => {
    let fileName = `${extractedName}-${fileType}.js`;
    if (isApiModule) {
      fileName = `${extractedName}-${fileType}.js`;
    }
    return fileName;
  },

  getStubData: (stubKey) => {
    return fs.readFileSync(
      path.join(__dirname, `../stubs/${stubKey}.stub`),
      'utf8'
    );
  },

  getClassName: (name, type) => {
    return _.startCase(name).replace(/\s/g, '') + _.capitalize(type);
  },

  setBaseController: (replacedData, isApiModule) => {
    const baseController = isApiModule
      ? api.baseController
      : cms.baseController;
    return replacedData.replace(/%baseController%/gi, baseController);
  },

  setBaseService: (replacedData, isApiModule) => {
    const baseService = isApiModule ? api.baseService : cms.baseService;
    return replacedData.replace(/%baseService%/gi, baseService);
  },

  checkExists: (filePath, type = 'File') => {
    if (fs.existsSync(filePath)) {
      throw new Error(`${type} already exists.`);
    }
  },

  generate: (path, data, type) => {
    fs.writeFileSync(path, data);
    console.log(colors.green('(✓)'), colors.blue(`===: ${type} generated`));
  }
};
