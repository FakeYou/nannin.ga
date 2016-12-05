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
  var query = {};
  if(!req.isAuthenticated()) {
    query.private = { $ne: true };
  }

  db.find(query).sort({ uploadedAt: -1 }).exec(function(err, docs) {
    debug(docs);

    if(err) { 
      debug(err);
      return next(err);
    }

    var files = docs.map(function(doc) {
      var hidden = (doc.private !== undefined) ? doc.private : false;

      return {
        name: doc.fileName,
        views: doc.views,
        private: hidden
      }
    });

    debug(files);

    res.render('index', { 
      files: files,
      isAuthenticated: req.isAuthenticated()
    });
  });
});

router.get('/make-public/:name', function(req, res, next) {
  if(!req.isAuthenticated()) {
    return res.redirect('/');
  }

  var db = app.get('db');
  var name = req.params.name;

  db.update({ fileName: name }, { $set: { private: false }});

  res.redirect('/');
});

router.get('/make-private/:name', function(req, res, next) {
  if(!req.isAuthenticated()) {
    return res.redirect('/');
  }

  var db = app.get('db');
  var name = req.params.name;

  db.update({ fileName: name }, { $set: { private: true }});

  res.redirect('/');
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
