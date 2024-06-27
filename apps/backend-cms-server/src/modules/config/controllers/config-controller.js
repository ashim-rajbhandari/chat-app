const Controller = require('backend-cms/src/modules/base/controllers/baseController');
class ConfigController extends Controller {
  constructor(opts) {
    super(opts);
    this.service = opts.configService;
    this.title = 'Configurations';
    this.view = '../configs';
    this.url = '/configs';
    this.module = 'configs.configs.';
  }

  async edit(req, res) {
    try {
      const config = await this.service.findOne({
        where: { id: req.params.id }
      });
      if (!config) {
        throw new Error('Configuration not found.');
      }
      const configedName = config.name;
      let error = false;
      let msg;

      if (req.body.checkbox && config.name == 'Check Apartment Duplication') {
        req.session.configData = await this.updateAndFetch(req.params.id, {
          value: true
        });
        req.flash('success_msg', configedName + ' Updated Successfully.');
        return res.redirect('back');
      }
      if (
        !req.body.checkbox &&
        !req.body.value &&
        config.name == 'Check Apartment Duplication'
      ) {
        req.session.configData = await this.updateAndFetch(req.params.id, {
          value: false
        });
        req.flash('success_msg', configedName + ' Updated Successfully.');
        return res.redirect('back');
      }

      if (!req.body.value) {
        msg = `${configedName} is a required field.`;
        error = true;
      }

      if (!error && req.body.value && req.body.value !== '') {
        if (
          /\D/g.test(req.body.value) &&
          configedName !== 'Null Field' &&
          configedName !== 'Assessment Gdrive Folder' &&
          configedName !== 'Assessment Gdrive Path'
        ) {
          msg = `${configedName} value must be only positive numbers.`;
          error = true;
        }
        if (!error && req.body.value <= 0) {
          msg = `${configedName} value must be at-least 1.`;
          error = true;
        }
      }

      if (
        !error &&
        configedName === 'Password Hashing Rounds' &&
        (req.body.value > 15 || req.body.value < 4)
      ) {
        msg = `${configedName} range must be between 4-15.`;
        error = true;
      }
      if (
        !error &&
        configedName === 'Syncing Retry Times For Rakumo' &&
        (req.body.value > 4 || req.body.value < 0)
      ) {
        msg = `${configedName} value must be between 1 - 4.`;
        error = true;
      }

      if (
        !error &&
        configedName === 'Null Feild Value' &&
        req.body.value.length > 10
      ) {
        msg = `${configedName} must not excced 10 characters.`;
        error = true;
      }

      if (
        (!error && configedName && req.body.value > 255) ||
        req.body.value.length > 255
      ) {
        msg = `${configedName} range is 255.`;
        error = true;
      }

      if (error) {
        throw new Error(msg);
      }

      req.session.configData = await this.updateAndFetch(
        req.params.id,
        req.body
      );
      req.flash('success_msg', configedName + ' Updated Successfully.');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async updateAndFetch(id, data) {
    await this.service.findAndUpdate(id, data);
    const configData = await this.service.getOnlyNameAndValue();
    return JSON.parse(JSON.stringify(configData));
  }
}

module.exports = ConfigController;
