const Controller = require('backend-cms/src/modules/base/controllers/baseController');
class EmailTemplateController extends Controller {
  constructor(opts) {
    super(opts);
    this.service = opts.emailTemplateService;
    this.title = 'Email Template';
    this.view = '../email';
    this.url = '/email-templates';
    this.module = 'email-templates.email-templates.';
  }
}

module.exports = EmailTemplateController;
