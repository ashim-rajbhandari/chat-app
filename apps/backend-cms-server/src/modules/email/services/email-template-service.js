const BaseService = require('backend-cms/src/modules/base/services/base.service');
const { emailTemplate } = require('shared/src/database/models');

class EmailTemplateService extends BaseService {
  constructor() {
    super(emailTemplate);
    this.filterFields = ['name', 'slug'];
  }
  async create(payload) {
    return this.model.create(payload);
  }

  async findAndUpdate(id, data) {
    delete data.code;
    await this.checkExists({ _id: id });
    return this.model.update(data, {
      where: { _id: id },
      individualHooks: true
    });
  }

  getData(req) {
    const payload = {
      ...this.buildFilterQuery(req),
      order: [['created_at', 'DESC']],
      page: req.query.page ?? 1
    };
    return this.getPaginatedData(payload);
  }

  getAll(req) {
    const payload = {
      ...this.buildFilterQuery(req),
      order: [['created_at', 'DESC']]
    };
    return this.findAll(payload);
  }
  async delete(id) {
    return this.model.destroy({ where: { _id: id } });
  }
}

module.exports = EmailTemplateService;
