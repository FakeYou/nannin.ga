var debug        = require('debug')('app');
var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var compression  = require('compression');
var passport     = require('passport');
var session      = require('express-session');
var ua           = require('universal-analytics');
var nedb         = require('nedb');

var nedbConfig   = require('./config/nedb');

var secrets      = require('../secrets');

var routes       = require('./routes/routes');
var upload       = require('./routes/upload');
var login        = require('./routes/login');

var visitor      = ua(secrets.googleAnalyticsID, { cookieName: '_ga' });
var db           = new nedb(nedbConfig);

db.persistence.setAutocompactionInterval(15 * 60 * 1000);

app = module.exports = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('db', db);

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(compression());  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: secrets.sessionSecret, resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  visitor.pageview(req.url).send();
  next();
});

app.use('/', routes);
app.use('/', login);
app.use('/upload', upload);

passport.serializeUser(function(user, done) {
  debug('serializeUser', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  debug('deserializeUser', id);
  done(null, { id: id });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
