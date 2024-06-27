const { isApiRequestOrAjax } = require('shared/src/helpers');
const http = require('http-status-codes');
const { singleErrorFormat } = require('shared/src/errors');

module.exports = {
  routeNotFoundHandler(app) {
    app.use('*', (req, res) => {
      if (isApiRequestOrAjax(req)) {
        return res.status(http.StatusCodes.NOT_FOUND).send(
          singleErrorFormat({
            statusCode: http.StatusCodes.NOT_FOUND,
            msg: 'Route not found'
          })
        );
      }
      res.status(404);
      res.render('error/404', {
        layout: false
      });
    });
  }
};
