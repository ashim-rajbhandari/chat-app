const path = require('path');
const fs = require('fs');
const colors = require('colors/safe');
const { init } = require('./generaters/db-model');

colors.enable();

((args) => {
  try {
    const migrationArg = args[2];
    console.log(migrationArg);

    if (!migrationArg?.includes('migration=')) {
      throw Error(
        'Please provide migration parameter. eg: migration=20220530043552-clients'
      );
    }

    let migrationName = migrationArg.split('=')[1];

    migrationName = migrationName.includes('.js')
      ? migrationName
      : `${migrationName}.js`;

    const migrationPath = path.resolve(
      __dirname,
      `../../../../packages/shared/src/database/migrations/${migrationName}`
    );

    if (!fs.existsSync(migrationPath)) {
      throw Error(`${migrationName} doesn't exists on migration directory.`);
    }
    const dbModelPath = path.resolve(
      __dirname,
      `../../../../packages/shared/src/database/models`
    );
    console.log(colors.magenta('===: ...generating'));
    init(dbModelPath, migrationName);
  } catch (error) {
    console.log(colors.red(`===: ${error.message}`));
  }
})(process.argv);
