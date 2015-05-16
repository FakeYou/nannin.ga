'use strict';

var debug   = require('debug')('app:routes:upload');
var express = require('express');
var multer  = require('multer');
var router  = express.Router();

var multerConfig = require('../config/multer');

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

  debug(req.body);
  debug(req.files);

  var filename = req.files.file.name;
  res.redirect('/' + filename);
}]);


module.exports = router;
