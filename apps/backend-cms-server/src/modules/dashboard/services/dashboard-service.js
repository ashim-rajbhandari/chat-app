const moment = require('moment');
const BaseService = require('backend-cms/src/modules/base/services/base.service');
const { Op } = require('sequelize');
class DashboardService extends BaseService {
  constructor() {
    super();
  }

  async getDashBoardData() {
    return {};
  }

  getFilter(type) {
    return { [Op.between]: [moment().startOf(type), moment().endOf(type)] };
  }

  getProgress(expected, count) {
    return Math.floor((count / expected) * 100);
  }
}

module.exports = DashboardService;
