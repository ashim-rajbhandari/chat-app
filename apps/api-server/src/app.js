const express = require('express');
const { bootstrap } = require('./loaders');
const app = express();

bootstrap(app);
