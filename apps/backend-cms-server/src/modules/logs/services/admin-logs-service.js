const BaseService = require('backend-cms/src/modules/base/services/base.service');
const { adminLogs, admin } = require('shared/src/database/models');
const { Op } = require('sequelize');
const moment = require('moment');

class AdminLogsService extends BaseService {
  constructor() {
    super(adminLogs);
  }

  async getData(req) {
    const payload = {
      ...(await this.buildFilterQuery(req, this.dateRangeFilterQuery(req))),
      order: [['id', 'DESC']],
      page: req.query.page ?? 1,
      include: [
        {
          model: admin,
          as: 'adminData',
          attributes: ['username'],
          paranoid: false
        }
      ]
    };
    return this.getPaginatedData(payload);
  }

  async getAdminData() {
    return admin.findAll({
      attributes: ['username', 'id']
    });
  }

  async indexPageData(req) {
    const { query } = req;
    let userData = {};
    if (query.user !== undefined && query.user !== '') {
      userData = await admin.findOne({
        where: { id: query.user },
        attributes: ['id', 'username']
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
      whereCondition.user_id = req.params.id;
      return { where: whereCondition };
    } else {
      if (query.user) {
        whereCondition.user_id = query.user;
      }
      return { where: whereCondition };
    }
  }

  dateRangeFilterQuery(req) {
    let filterQuery = {};
    const { query } = req;

    let from;
    let to;

    if (Object.keys(query).length > 0) {
      if (query.daterange) {
        const range = query.daterange.split('-');
        from = moment(range[0].trim(), 'MM/DD/YYYY').startOf('day');
        to = moment(range[1].trim(), 'MM/DD/YYYY').endOf('day');
      }
    } else {
      from = moment().subtract(30, 'd').startOf('day');
      to = moment().endOf('day');
    }
    filterQuery['created_at'] = {
      [Op.between]: [new Date(from), new Date(to)]
    };
    return { ...filterQuery };
  }
}
module.exports = AdminLogsService;
