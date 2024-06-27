const {
  extractOnlyName,
  getStubData,
  getClassName,
  generate
} = require('../utils');

module.exports = {
  init: (payload) => {
    const { folderPath, moduleName } = payload;
    const extractedName = extractOnlyName(moduleName);
    const fileName = `${extractedName}-transformer.js`;
    const stubData = getStubData('transformers');
    const className = getClassName(extractedName, 'transformer');
    const replacedData = stubData.replace(/%transformerName%/gi, className);
    generate(`${folderPath}/${fileName}`, replacedData, 'transformer');
  }
};
