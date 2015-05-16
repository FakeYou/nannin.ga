'use strict';

var chance    = require('chance').Chance();
var appConfig = require('./app');

var config = {
  dest: appConfig.uploadPath,
  rename: function() {
    return chance.hash({ length: 4 }); 
  }
};

module.exports = config;