const { getStubData, generate } = require('../utils');

module.exports = {
  init: (payload) => {
    const { folderPath } = payload;
    const fileName = `index.js`;
    const stubData = getStubData('routes');
    generate(`${folderPath}/${fileName}`, stubData, 'route');
  }
};
