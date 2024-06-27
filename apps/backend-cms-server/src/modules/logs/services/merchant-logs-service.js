const BaseService = require('backend-cms/src/modules/base/services/base.service');
const { activityLogs, merchants } = require('shared/src/database/models');
const { Op } = require('sequelize');
const moment = require('moment');

class MerchantActivityLogsService extends BaseService {
  constructor() {
    super(activityLogs);
  }

  async getData(req) {
    const payload = {
      ...(await this.buildFilterQuery(req, this.dateRangeFilterQuery(req))),
      order: [['id', 'DESC']],
      page: req.query.page ?? 1,
      include: [
        {
          model: merchants,
          as: 'merchantData',
          attributes: ['full_name'],
          paranoid: false
        }
      ]
    };
    return this.getPaginatedData(payload);
  }

  async getMerchantData() {
    return merchants.findAll({
      attributes: ['full_name', 'id']
    });
  }

  async indexPageData(req) {
    const { query } = req;
    let userData = {};
    if (query.user !== undefined && query.user !== '') {
      userData = await merchants.findOne({
        where: { id: query.user },
        attributes: ['id', 'full_name']
      });
    }
    let defaultRange =
      moment().subtract(30, 'd').format('MM/DD/YYYY') +
      ' - ' +
      moment().format('MM/DD/YYYY');
    if (req.params.id) {
      defaultRange =
        moment().startOf('week').format('MM/DD/YYYY') +
        ' - ' +
        moment().endOf('week').format('MM/DD/YYYY');
    }
    return {
      userData,
      ...(await this.getData(req)),
      defaultRange
    };
  }

  async buildFilterQuery(req, whereCondition = {}) {
    const { query } = req;
    if (req.params.id) {
      whereCondition.merchant_id = req.params.id;
      return { where: whereCondition };
    } else {
      if (query.user) {
        whereCondition.merchant_id = query.user;
      }
      return { where: whereCondition };
    }
  }

  dateRangeFilterQuery(req) {
    let filterQuery = {};
    const { query } = req;

    let from = moment().subtract(30, 'd').startOf('day');
    let to = moment().endOf('day');

    if (Object.keys(query).length > 0) {
      if (query.daterange) {
        const range = query.daterange.split('-');
        from = moment(range[0].trim(), 'MM/DD/YYYY').startOf('day');
        to = moment(range[1].trim(), 'MM/DD/YYYY').endOf('day');
      }
    }
    filterQuery['created_at'] = {
      [Op.between]: [new Date(from), new Date(to)]
    };
    return { ...filterQuery };
  }
}
module.exports = MerchantActivityLogsService;
