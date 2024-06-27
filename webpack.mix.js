let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix
  .js(
    'apps/backend-cms-server/resources/assets/system/js/system.js',
    'apps/backend-cms-server/public/js/'
  )
  .sass(
    'apps/backend-cms-server/resources/assets/system/scss/system.scss',
    'apps/backend-cms-server/public/css'
  )
  .options({
    processCssUrls: false
  })
  .sourceMaps();
mix.js(
  'apps/backend-cms-server/resources/assets/system/js/admins.js',
  'apps/backend-cms-server/public/js/'
);
mix.js(
  'apps/backend-cms-server/resources/assets/system/js/socket.js',
  'apps/backend-cms-server/public/js/'
);
mix.js(
  'apps/backend-cms-server/resources/assets/system/js/select-2-ajax.js',
  'apps/backend-cms-server/public/js/'
);
mix.js(
  'apps/backend-cms-server/resources/assets/system/js/global-search.js',
  'apps/backend-cms-server/public/js/'
);
mix.js(
  'apps/backend-cms-server/resources/assets/system/js/copy-text-to-clipboard.js',
  'apps/backend-cms-server/public/js/'
);

mix.js('apps/backend-cms-server/resources/assets/system/vue/app.js', 'apps/backend-cms-server/public/vue/js').vue();