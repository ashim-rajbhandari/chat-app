const BaseService = require('backend-cms/src/modules/base/services/base.service');
const { config } = require('shared/src/database/models');
const { Op } = require('sequelize');

class ConfigService extends BaseService {
  constructor() {
    super(config);
    this.filterFields = ['name'];
  }

  getData(req) {
    const payload = {
      ...this.buildFilterQuery(req, { name: { [Op.ne]: 'ip-access' } }),
      order: [['name', 'ASC']],
      page: req.query.page ?? 1
    };
    return this.getPaginatedData(payload);
  }

  async getOnlyNameAndValue() {
    return config.findAll({ attributes: ['name', 'value'] });
  }

  async findAndUpdate(id, data) {
    return this.model.update(data, {
      where: { id: id },
      individualHooks: true
    });
  }

  async delete(id) {
    return this.model.destroy({ where: { _id: id } });
  }
}

module.exports = ConfigService;
