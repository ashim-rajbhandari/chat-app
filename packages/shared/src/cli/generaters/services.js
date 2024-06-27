const {
  extractOnlyName,
  getFileName,
  getStubData,
  getClassName,
  setBaseService,
  generate
} = require('../utils');

module.exports = {
  init: (payload) => {
    const { folderPath, moduleName, isApiModule } = payload;
    const extractedName = extractOnlyName(moduleName);
    const fileName = getFileName(extractedName, 'service', isApiModule);
    const stubData = getStubData('services');
    const className = getClassName(extractedName, 'service');
    let replacedData = stubData.replace(/%serviceName%/gi, className);
    replacedData = setBaseService(replacedData, isApiModule);
    generate(`${folderPath}/${fileName}`, replacedData, 'service');
  }
};
