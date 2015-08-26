'use strict';

var debug         = require('debug')('app:routes:login');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt        = require('bcrypt');
var express       = require('express');
var router        = express.Router();

var secrets = require('../../secrets');
var passportConfig = require('../config/passport');

passport.use(new LocalStrategy(
  function(username, password, done) {
    var valid = bcrypt.compareSync(password, secrets.uploadPassword);

    debug(valid);

    if(valid) {
      return done(null, { id: 1 });
    }
    else {
      return done(null, false);
    }
  }
));

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/login', passport.authenticate('local', passportConfig));


module.exports = router;
