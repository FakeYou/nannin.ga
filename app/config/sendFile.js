'use strict';

var appConfig = require('./app');

var config = {
  root: appConfig.uploadPath,
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};

module.exports = config;