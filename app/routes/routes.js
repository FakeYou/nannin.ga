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

  var db = app.get('db');

  debug(req.isAuthenticated());

  db.find({}).sort({ uploadedAt: -1 }).exec(function(err, docs) {
    if(err) { 
      debug(err);
      return next(err);
    }

    var files = docs.map(function(doc) {
      return {
        name: doc.fileName,
        views: doc.views
      }
    });

    debug(files);

    res.render('index', { 
      files: files,
      isAuthenticated: req.isAuthenticated()
    });
  });
});

router.get(/^\/.{4}((\.\w{2,4})|$)/, function(req, res, next) {
  var name = path.parse(req.url).name;
  var query = path.join(appConfig.uploadPath, name + '.*');

  glob(query, function(err, files) {

    if(err) {
      debug(err);
      return next(err);
    }

    if(files.length === 0) {
      return res.send(404);
    }
    
    var db = app.get('db');
    db.update({ fileName: new RegExp(name + '(\\..*)?') }, { $inc: { views: 1 }});

    var file = path.basename(files[0]);

    res.sendFile(file, sendFileConfig);
  });
});

module.exports = router;
