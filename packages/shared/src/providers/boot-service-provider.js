module.exports = class BootServiceProvider {
  static boot(bootPayload) {
    const { APP, PORT, APP_NAME } = bootPayload;
    APP.listen(PORT, (err) => {
      if (err) {
        console.error(`${APP_NAME} ERROR: ${err}`);
        return;
      }
      console.log(`${APP_NAME} listening on port ${PORT}`);
    });
  }
};
