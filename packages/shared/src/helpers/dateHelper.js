const moment = require('moment');
require('dotenv').config();

module.exports = {
  formatDate: (date, format) => {
    let dateFormat = format || 'YYYY-MM-DD HH:mm:ss';
    return moment(date, dateFormat).tz('Asia/Kathmandu').format(dateFormat);
  },
  formatDateString: (date, format) => {
    if (date && date != '') {
      let dateFormat = format || 'YYYY/MM/DD';
      return moment(date, dateFormat).format(dateFormat);
    }
    return null;
  }
};
