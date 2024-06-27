const Controller = require('backend-cms/src/modules/base/controllers/baseController');

class MerchantLogsController extends Controller {
  constructor(opts) {
    super(opts);
    this.service = opts.merchantLogsService;
    this.title = 'Merchant Logs';
    this.view = '../merchant-logs';
    this.url = '/merchant-logs';
    this.module = 'logs.merchant-logs.view';
  }

  async index(req, res) {
    try {
      this.innerPage = this.view + '/index';
      let data = await this.service.indexPageData(req);
      data.merchantData = await this.service.getMerchantData();
      return res.render(
        'layout/base-inner',
        this.viewData(data, this.module + 'view')
      );
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect('/home');
    }
  }
}

module.exports = MerchantLogsController;
