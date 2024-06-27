const moment = require('moment');
const redis = require('../../../config/redis');
const config = require('../../../config');
const sequelize = require('sequelize');
const { Op } = sequelize;
class BaseService {
  constructor(model) {
    this.model = model;
    this.limit = config.pageLimit;
    this.config = config;
  }

  get filterFields() {
    return this._filterFields;
  }

  set filterFields(value) {
    this._filterFields = value;
  }

  async indexPageData(req) {
    return {
      ...(await this.getData(req))
    };
  }

  defaultRange() {
    return {
      defaultRange:
        moment().subtract(30, 'd').format('MM/DD/YYYY') +
        ' - ' +
        moment().format('MM/DD/YYYY')
    };
  }

  getData(req) {
    let order = req.query.order ? req.query.order : 'id';
    let sort = req.query.sort ? req.query.sort : 'DESC';

    const payload = {
      ...this.buildFilterQuery(req),
      order: [[order, sort]],
      page: req.query.page ?? 1
    };

    const selectedColumns = this.selectedColumns || [];
    if (selectedColumns.length > 0) {
      payload['attributes'] = selectedColumns;
    }

    const orderBy = this.orderBy || [];
    if (orderBy.length > 0) {
      payload['order'] = orderBy;
    }

    return this.getPaginatedData(payload);
  }

  buildFilterQuery(req, whereCondition = null) {
    const { query } = req;
    if (query.keyword) {
      if (whereCondition === null) {
        whereCondition = {};
      }
      whereCondition[Op.or] = this.buildKeywordQuery(query.keyword);
    }
    return { where: whereCondition };
  }

  buildKeywordQuery(keyword) {
    const queryArray = [];
    const filterArray = this.filterFields;
    for (const field of filterArray) {
      queryArray.push({
        [field]: { [Op.iLike]: `%${keyword.trim()}%` }
      });
    }
    return queryArray;
  }

  dateRangeFilterQuery(query, dateColumn = 'created_at') {
    let filterQuery = {};
    let from = moment().subtract(30, 'd').startOf('day');
    let to = moment().endOf('day');

    if (query.daterange) {
      const range = query.daterange.split('-');
      from = moment(range[0].trim(), 'MM/DD/YYYY').startOf('day');
      to = moment(range[1].trim(), 'MM/DD/YYYY').endOf('day');
    }
    filterQuery[dateColumn] = {
      [Op.between]: [new Date(from), new Date(to)]
    };
    return { ...filterQuery };
  }

  async getPaginatedData(query = {}) {
    query.paginate = this.paginate !== undefined ? this.paginate : this.limit;
    const { docs, pages, total } = await this.model.paginate(query);
    let from = (query.page - 1) * query.paginate + 1;
    let to = from + (docs.length - 1);
    return {
      docs,
      total,
      pageNum: query.page,
      pageLimit: query.paginate,
      pageCount: pages,
      queryValue: query.keyword ?? null,
      currentPage: query.page,
      from,
      to
    };
  }

  async findAll(query) {
    const docs = await this.model.findAll(query);
    return {
      docs,
      queryValue: query?.keyword ?? null
    };
  }

  async findOne(query) {
    let data = await this.model.findOne({
      where: query.where,
      attributes: query.attributes
    });
    if (data === null) {
      throw new Error('Data not found');
    }
    return data;
  }

  async find(query) {
    return this.model.findOne({
      where: query.where
    });
  }

  async count(query) {
    return this.model.count({ where: query.where });
  }

  async createPageData() {
    return {};
  }

  customBreadCrumb(customs) {
    return [].concat(customs);
  }
  /* eslint-disable no-unused-vars */
  async create(data, trx = null) {
    if (this.clearCache) {
      await redis.clearPaginationCache(this.cacheKey);
    }
    return this.model.create(data, { transaction: trx });
  }

  async bulkCreate(data, trx) {
    return this.model.bulkCreate(data, {
      returning: true,
      transaction: trx
    });
  }

  async editPageData(id) {
    return { data: await this.findOrFail(id) };
  }

  async findAndUpdate(id, data, trx = null) {
    await this.checkExists({ _id: id });
    if (this.clearCache) {
      await redis.clearPaginationCache(this.cacheKey);
    }
    return this.model.update(data, {
      where: { _id: id },
      individualHooks: true,
      transaction: trx
    });
  }

  findOrFail(id, attributes = null) {
    return this.model
      .findOne({
        where: { _id: id },
        attributes: attributes
      })
      .then(function (record) {
        if (record) {
          return record;
        } else {
          throw new Error('Data not found');
        }
      });
  }

  async checkExists(query) {
    let count = await this.model.count({ where: query });
    if (count === 0) {
      throw new Error('Data not found');
    }
  }

  async delete(id, trx = null) {
    await this.checkExists({ _id: id });
    if (this.clearCache) {
      await redis.clearPaginationCache(this.cacheKey);
    }
    return this.model.destroy({ where: { _id: id }, transaction: trx });
  }

  async destroy(id) {
    await this.checkExists({ id: id });
    if (this.clearCache) {
      await redis.clearPaginationCache(this.cacheKey);
    }
    return this.model.destroy({ where: { id: id } });
  }

  async findOneAndUpdate(query, updateData, trx = null) {
    return this.model.update(updateData, {
      where: query.where,
      individualHooks: true,
      transaction: trx
    });
  }

  upsert(values, query) {
    return this.model.findOne(query).then(function (obj) {
      // update
      if (obj) {
        return obj.update(values);
      }
      // insert
      return this.model.create(values);
    });
  }

  async customPagination(query, page, limit = this.limit) {
    this.model.findAll(this.paginateModel(query, { page, limit }));
  }

  paginateModel(query, { page, pageSize }) {
    const offset = page * pageSize;
    const limit = pageSize;

    return {
      ...query,
      offset,
      limit
    };
  }

  async changeStatus(id) {
    const data = await this.model.findOne({ where: { _id: id } });
    if (data === null) {
      throw new Error('Data not found.');
    }
    data.status = !data.status;
    await data.save();
    if (this.clearCache) {
      await redis.clearPaginationCache(this.cacheKey);
    }
    return data;
  }
}

module.exports = BaseService;
