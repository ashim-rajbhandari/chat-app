const { adminLogs, merchantProjects } = require('shared/src/database/models');
async function createActivityLog(id, message, options = null, value) {
  try {
    const data = {};
    data.message = message;
    data.user_id = id;
    if (options === 'token') {
      const projectData = await merchantProjects.findOne({
        where: { id: value },
        attributes: ['project_title']
      });
      data.message = `${data.message} ${projectData.project_title}`;
    }
    return await adminLogs.create(data);
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  createActivityLog
};
