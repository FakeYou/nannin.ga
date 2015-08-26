'use strict';

var debug   = require('debug')('app:routes:upload');
var express = require('express');
var multer  = require('multer');
var nedb    = require('nedb');
var router  = express.Router();

var multerConfig = require('../config/multer');
var nedbConfig = require('../config/nedb');

router.get('/', function(req, res) {
  debug(req.user);
  debug(req.isAuthenticated());

  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  res.render('upload');
});

router.post('/', [ multer(multerConfig), function(req, res) {
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  if(!req.files) {
    res.redirect('/upload');
  }

  var db = app.get('db');
  debug(req.files.file);
  
  var doc = {
    originalName: req.files.file.originalname,
    fileName: req.files.file.name,
    uploadedAt: new Date(),
    ipAddress: req.connection.remoteAddress,
    views: 0
  };
  
  debug(doc);
  db.insert(doc, function(err) {
    if(err) {
      throw err;
    }
    
    var filename = doc.fileName;
    res.redirect('/' + filename);
  });

}]);


module.exports = router;
