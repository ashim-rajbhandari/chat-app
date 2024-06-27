module.exports = class StaticPathProvider {
  static register(app, staticPath) {
    app.use(staticPath);
  }
};
