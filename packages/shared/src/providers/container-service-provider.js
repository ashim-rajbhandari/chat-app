require('module-alias/register');
const awilix = require('awilix');

const { Lifetime } = awilix;

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});
const containerSetup = () => {
  container.loadModules(
    [
      './src/**/controllers/**/*-controller.js',
      'apps/backend-cms-server/**/controllers/**/*-controller.js',
      'apps/api-server/**/controllers/**/*-controller.js'
    ],
    {
      resolverOptions: {
        register: awilix.asClass,
        lifetime: Lifetime.transient
      },
      formatName: 'camelCase'
    }
  );

  container.loadModules(
    [
      './src/**/services/**/*-service.js',
      'apps/backend-cms-server/**/services/**/*-service.js',
      'apps/api-server/**/services/**/*-service.js',
      './src/**/transformers/**/*-transformer.js',
      'apps/backend-cms-server/**/transformers/**/*-transformer.js',
      'apps/api-server/**/transformers/**/*-transformer.js'
    ],
    {
      resolverOptions: {
        register: awilix.asClass,
        lifetime: Lifetime.SINGLETON
      },
      formatName: 'camelCase'
    }
  );
  container.register({
    bindAll: awilix.asFunction(() => (instance, prototype) => {
      // Get methods
      const proto = Object.getPrototypeOf(instance);
      const methods = [
        ...Object.getOwnPropertyNames(prototype),
        ...Object.getOwnPropertyNames(proto)
      ];

      // Bind methods
      // eslint-disable-next-line no-restricted-syntax
      for (const method of methods) {
        if (typeof instance[method] === 'function') {
          instance[method] = instance[method].bind(instance);
        }
      }
    }),
    container: awilix.asFunction(() => container)
  });
};

module.exports = {
  container,
  containerSetup
};
