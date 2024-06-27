const {
  base64encode,
  translateLanguage,
  checkBlankEntries
} = require('shared/src/helpers');
const MultipleDeleteError = require('shared/src/errors/multipleDeleteError');
class BaseController {
  constructor({ bindAll, container }) {
    this.container = container;
    bindAll(this, BaseController.prototype);
    this.breadCrums = {};
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get innerPage() {
    return this._innerPage;
  }

  set innerPage(value) {
    this._innerPage = value;
  }

  async index(req, res) {
    try {
      this.innerPage = this.view + '/index';
      let data = await this.service.indexPageData(req);
      data.breadcrumbs = this.indexBreadCrumb();
      req.session.cancelUrl = req.originalUrl;
      return res.render(
        'layout/base-inner',
        this.viewData(data, this.module + 'view')
      );
    } catch (error) {
      console.log(error);
      req.flash('error_msg', error.message);
      return res.redirect('/home');
    }
  }

  async addView(req, res) {
    try {
      this.innerPage = this.view + '/add';
      const data = await this.service.createPageData(req);
      data.breadcrumbs = this.formBreadCrumb('Create');
      return res.render(
        'layout/base-inner',
        this.viewData(data, this.module + 'create', 'Add ' + this.title)
      );
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect('back');
    }
  }

  async add(req, res) {
    try {
      await this.service.create(checkBlankEntries(req.body));
      req.flash('success_msg', this.title + ' added successfully.');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('inputData', req.body);
      req.flash('error_msg', error.message);
      return res.redirect('back');
    }
  }

  async editView(req, res) {
    try {
      this.innerPage = this.view + '/edit';
      const data = await this.service.editPageData(req.params.id);
      const version = JSON.parse(JSON.stringify(data)).data.version;
      if (version) {
        data.verNum = base64encode(version.toString());
      }
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
      await this.service.findAndUpdate(
        req.params.id,
        checkBlankEntries(req.body)
      );
      req.flash('success_msg', this.title + ' updated successfully');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('inputData', req.body);
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);
      req.flash('success_msg', this.title + ' deleted successfully');
      return res.redirect('back');
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect('back');
    }
  }

  async deleteMultiple(req, res) {
    try {
      await this.service.deleteMultiple(req.body.data_ids);
      req.flash('success_msg', this.title + ' deleted successfully');
      return res.redirect('back');
    } catch (error) {
      if (error instanceof MultipleDeleteError) {
        const splittedText = error.message.split('||');
        const transMsg = translateLanguage(
          splittedText[1].trim(),
          req.session.translationdata,
          'global'
        );
        req.flash('un_trans_error', `${splittedText[0]}${transMsg}`);
      } else {
        req.flash('error_msg', error.message);
      }
      return res.redirect(this.url);
    }
  }

  viewData(data, module, title, originalUrl = null) {
    return {
      ...data,
      pageTitle: title ?? this.title,
      innerPage: this.innerPage,
      module: module,
      url: originalUrl !== null ? originalUrl : this.url
    };
  }

  indexBreadCrumb(originalUrl = undefined, mergedWithFormBreadcrumb = false) {
    let url = this.url;
    if (originalUrl) {
      url = originalUrl;
    }
    return [
      // {...this.dashboardBreadCrumb()},
      { title: this.title, link: mergedWithFormBreadcrumb ? url : '#' }
    ];
  }

  formBreadCrumb(title, cancelUrl = undefined) {
    return [...this.indexBreadCrumb(cancelUrl, true), { title: title }];
  }

  dashboardBreadCrumb() {
    return {
      title: 'Dashboard',
      link: '/home'
    };
  }

  customBreadCrumb(customs) {
    return [
      // { ...this.dashboardBreadCrumb()}
    ].concat(customs);
  }

  async changeStatus(req, res) {
    try {
      await this.service.changeStatus(req.params.id);
      req.flash('success_msg', this.title + '  updated successfully');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }
}
module.exports = BaseController;
