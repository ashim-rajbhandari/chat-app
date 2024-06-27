const {
  extractOnlyName,
  getFileName,
  getStubData,
  getClassName,
  setBaseController,
  generate
} = require('../utils');

module.exports = {
  init: (payload) => {
    const { folderPath, moduleName, isApiModule } = payload;
    const extractedName = extractOnlyName(moduleName);
    const fileName = getFileName(extractedName, 'controller', isApiModule);
    const stubData = getStubData('controllers');
    const className = getClassName(extractedName, 'controller');
    let replacedData = stubData.replace(/%controllerName%/gi, className);
    replacedData = setBaseController(replacedData, isApiModule);
    generate(`${folderPath}/${fileName}`, replacedData, 'controller');
  }
};
