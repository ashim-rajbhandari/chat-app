const cmsModuleDefaultFolders = ['routes', 'controllers', 'services'];
module.exports = {
  apps: {
    cms: 'backend-cms-server',
    api: 'api-server'
  },
  cmsModuleDefaultFolders,
  apiModuleDefaultFolders: [...cmsModuleDefaultFolders, 'transformers'],
  api: {
    baseController: 'shared/src/controllers/apiBaseController',
    baseService: 'shared/src/services/api.base.service'
  },
  cms: {
    baseController: 'backend-cms/src/modules/base/controllers/baseController',
    baseService: 'backend-cms/src/modules/base/services/base.service'
  }
};
