const { checkBlankEntries } = require('shared/src/helpers');
class BaseTransformer {
  transformItem(item) {
    return checkBlankEntries(this.transform(item));
  }

  transformItems(items) {
    let data = [];
    for (let item of items) {
      data.push(checkBlankEntries(this.transform(item)));
    }
    return data;
  }

  async asyncTransformItems(items, loggedInUserId = undefined) {
    let data = [];
    for (let item of items) {
      data.push(checkBlankEntries(await this.transform(item, loggedInUserId)));
    }
    return data;
  }
}

module.exports = BaseTransformer;
