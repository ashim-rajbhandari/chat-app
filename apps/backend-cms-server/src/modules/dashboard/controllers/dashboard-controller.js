const Controller = require('backend-cms/src/modules/base/controllers/baseController');
class DashboardController extends Controller {
  constructor(opts) {
    super(opts);
    this.service = opts.dashboardService;
    this.title = 'Dashboard';
    this.view = '../dashboard';
    this.url = '/home';
    this.module = 'home';
  }

  async index(req, res) {
    try {
      this.innerPage = this.view + '/index';
      const data = await this.service.getDashBoardData();
      data.breadcrumbs = this.indexBreadCrumb();
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

module.exports = DashboardController;
