const { config } = require('shared/src/database/models');
const { MAINSUPERADMIN } = require('backend-cms/src/constants');
const flash = require('connect-flash');

module.exports = class ReqLocalsProvider {
  static register(app) {
    app.use(flash());

    app.use(async (req, res, next) => {
      if (!req.session.configData) {
        const configData = await config.findAll({
          attributes: ['name', 'value']
        });
        req.session.configData = JSON.parse(JSON.stringify(configData));
      }
      next();
    });

    app.use((req, res, next) => {
      res.locals['MAINSUPERADMIN'] = MAINSUPERADMIN;
      res.locals['error_msg'] = req.flash('error_msg');
      res.locals.inputData = req.flash('inputData')[0];
      res.locals['success_msg'] = req.flash('success_msg');
      res.locals.errors = req.flash('errors');
      res.locals.query = req.query;
      res.locals.url = req.url;
      res.locals.session = req.session;
      res.locals.configData = req.session?.configData || null;
      let none = 'N/A';
      const nullValue = req.session.configData
        .filter((x) => x.name === 'Null Field')
        .map((x) => x.value);
      res.locals.nil = nullValue[0] || none;

      next();
    });
  }
};
