const { getConfigData, bcryptPassword } = require('shared/src/helpers');
const Controller = require('backend-cms/src/modules/base/controllers/baseController');
const { admin } = require('shared/src/database/models');
const bcrypt = require('bcryptjs');
const { createActivityLog } = require('backend-cms/src/helpers');
const LogMessage = require('backend-cms/src/constants');

class EditAdminProfileController extends Controller {
  constructor(opts) {
    super(opts);
    this.service = opts.editAdminProfileService;
    this.title = ' Profile';
    this.view = '../edit-admin-profile';
    this.url = '/home';
    this.module = 'user-management.admins.';
  }

  async editView(req, res) {
    try {
      if (req?.session?.user?._id !== req?.params?.id) {
        throw new Error('Unauthorized Action.');
      }
      this.innerPage = this.view + '/edit';
      const data = await this.service.editPageData(req.params.id);
      data.breadcrumbs = this.formBreadCrumb('Edit', req?.session?.cancelUrl);
      return res.render(
        'layout/base-inner',
        this.viewData(data, this.module + 'edit', 'Edit ' + this.title)
      );
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async edit(req, res) {
    try {
      if (req?.session?.user?._id !== req?.params?.id) {
        throw new Error('Unauthorized Action.');
      }
      let hashround = 10;
      if (req?.body?.password) {
        if (
          getConfigData(req, 'Password Hashing Rounds') &&
          getConfigData(req, 'Password Hashing Rounds') !== ''
        ) {
          hashround = parseInt(getConfigData(req, 'Password Hashing Rounds'));
        }
        const admins = await admin.findOne({
          where: { _id: req.session.user._id },
          attributes: ['password']
        });
        if (admins.password) {
          const adminPassword = bcrypt.compareSync(
            req.body.current_password,
            admins.password
          );
          if (!adminPassword) {
            throw new Error('Please enter your correct old password.');
          }
          const oldPasswordReused = bcrypt.compareSync(
            req.body.password,
            admins.password
          );
          if (oldPasswordReused) {
            throw new Error(
              'New password cannot be the same as your previous password.'
            );
          }
        }
        await this.service.updateUser(
          req,
          bcryptPassword(req.body.password, hashround)
        );
      } else {
        await this.service.updateUser(req);
      }
      createActivityLog(req?.session?.user?.id, LogMessage.UPDATEDPROFILE);
      req.flash('success_msg', 'Profile updated successfully.');
      return res.redirect('back');
    } catch (error) {
      console.log(error);
      req.flash('error_msg', error.message);
      return res.redirect('back');
    }
  }
}

module.exports = EditAdminProfileController;
