'use strict';

var debug   = require('debug')('app:routes:routes');
var fs      = require('fs');
var glob    = require('glob');
var path    = require('path');
var express = require('express');
var router  = express.Router();

var appConfig = require('../config/app');
var sendFileConfig = require('../config/sendFile');

router.get('/', function(req, res, next) {
  fs.readdir(appConfig.uploadPath, function(err, files){
    if(err) {
      debug(err);
      return next(err);
    }

    files = files.map(function(file) {
      return file.toLowerCase();
    });

    res.render('index', { files: files });
  });
});

router.get(/^\/.{4}((\.\w{2,4})|$)/, function(req, res, next) {
  var name = path.parse(req.url).name;
  var query = path.join(appConfig.uploadPath, name + '.*');

  debug(query);

  glob(query, function(err, files) {

    if(err) {
      debug(err);
      return next(err);
    }

    if(files.length === 0) {
      return res.send(404);
    }

    var file = path.basename(files[0]);

    res.sendFile(file, sendFileConfig);
  });
});

module.exports = router;
