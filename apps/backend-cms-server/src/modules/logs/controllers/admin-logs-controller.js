const Controller = require('backend-cms/src/modules/base/controllers/baseController');

class AdminLogsController extends Controller {
  constructor(opts) {
    super(opts);
    this.service = opts.adminLogsService;
    this.title = 'Admin Logs';
    this.view = '../admin-logs';
    this.url = '/admin-logs';
    this.module = 'logs.admin-logs.view';
  }

  async index(req, res) {
    try {
      this.innerPage = this.view + '/index';
      let data = await this.service.indexPageData(req);
      data.adminData = await this.service.getAdminData();
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

module.exports = AdminLogsController;
