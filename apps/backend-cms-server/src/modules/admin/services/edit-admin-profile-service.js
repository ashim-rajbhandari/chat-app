const BaseService = require('backend-cms/src/modules/base/services/base.service');
const { admin } = require('shared/src/database/models');
const { uploadFileToPath } = require('shared/src/helpers');

class InformationService extends BaseService {
  constructor() {
    super(admin);
  }

  async updateUser(req, password = null) {
    try {
      const userData = await this.findOne({
        where: { _id: req.params.id }
      });
      let updateData = this.parseAdminData(req.body, password);
      if (req.files) {
        updateData['image'] = uploadFileToPath({
          file: req.files.image,
          absDir: '/uploads/admins/',
          rootDir: 'public/backend',
          replacePreviousFile: { fileName: userData.image }
        });
      }
      let updatedUser = await admin.update(updateData, {
        where: { _id: req.params.id },
        individualHooks: true
      });
      if (updatedUser[1][0]._id == req.session.user._id) {
        req.session.user.first_name = updatedUser[1][0].first_name;
        req.session.user.last_name = updatedUser[1][0].last_name;
        req.session.user.image = updatedUser[1][0].image;
      }
      return updatedUser;
    } catch (error) {
      req.flash('error_msg', error.message);
      throw error;
    }
  }

  parseAdminData(data, password) {
    const parsed = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      username: data.username,
      contact_number: data.contact_number,
      mobile_num: data.mobile_num,
      fax: data.fax,
      updated_at: new Date()
    };
    if (password !== null) {
      parsed['password'] = password;
    }
    return parsed;
  }
}

module.exports = InformationService;
