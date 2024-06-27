const {
  extractTableName,
  getStubData,
  getDbModelName,
  generate,
  checkExists
} = require('../utils');

module.exports = {
  init: (dbModelPath, migrationName) => {
    const tableName = extractTableName(migrationName);
    const modelName = getDbModelName(tableName);
    checkExists(`${dbModelPath}/${modelName}.js`, 'DB model');

    const stubData = getStubData('db-model');
    const replacedData = stubData
      .replace(/%migrationName%/gi, migrationName)
      .replace(/%tableName%/gi, tableName)
      .replace(/%modelName%/gi, modelName);

    generate(`${dbModelPath}/${modelName}.js`, replacedData, 'dbModel');
  }
};
