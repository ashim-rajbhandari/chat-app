class ExceptionError extends Error {
  constructor(status, message, param, title) {
    super(message);
    this.title = title ? title : message;
    this.statusCode = status;
    this.param = param ? param : '';
  }
}

module.exports = ExceptionError;
