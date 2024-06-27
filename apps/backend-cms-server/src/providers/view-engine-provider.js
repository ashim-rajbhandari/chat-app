module.exports = class ViewEngineProvider {
  static register(app, options) {
    const { engine, viewPath } = options;
    app.set('views', viewPath);
    app.set('view engine', engine);
  }
};
