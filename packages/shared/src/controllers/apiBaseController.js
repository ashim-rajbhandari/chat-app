const http = require('http-status-codes');
const { responseFormat } = require('shared/src/responseFormat');
class ApiBaseController {
  constructor({ bindAll, container }) {
    this.container = container;
    bindAll(this, ApiBaseController.prototype);
  }
  async getAllResource(req, res) {
    let data = await this.service.getData(req);
    return this.respondWithPagination(
      res,
      this.transformer.transformItems(data.docs),
      data.pagination
    );
  }

  async getResourceById(req, res) {
    let data = await this.service.findOne({
      where: { _id: req.params.id }
    });
    return this.respondWithItem(res, this.transformer.transformItem(data));
  }

  respondWithItem(res, data) {
    return res.status(http.StatusCodes.OK).send(responseFormat(data));
  }

  respondWithPagination(res, data, pagination) {
    return res
      .status(http.StatusCodes.OK)
      .send(responseFormat(data, pagination));
  }

  respondWithOutPagination(res, data) {
    return res.status(http.StatusCodes.OK).send(responseFormat(data));
  }

  formattedResponse(res, data) {
    return res.status(http.StatusCodes.OK).send(responseFormat(data));
  }

  noContent(res) {
    return res.status(http.StatusCodes.NO_CONTENT).send({});
  }

  respondOk(res, message = {}) {
    return res.status(http.StatusCodes.OK).send(message);
  }
}
module.exports = ApiBaseController;
