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

    files = files
      .map(function(v) { return { name: v, time:fs.statSync(appConfig.uploadPath + '/' + v).mtime.getTime() }; })
      .sort(function(a, b) { return b.time - a.time; })
      .map(function(v) { return v.name.toLowerCase(); });

    debug(files);

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
