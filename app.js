var express = require('express');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var compression = require('compression');
var cors = require('cors');
var flash = require('connect-flash');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var routes = require('./routes/index');

var app = express();


passport.serializeUser(function(user, done) {
    done(null, 1);
});

passport.deserializeUser(function(id, done) {
    done(null, 1);
    //User.findById(id, function(err, user) {
    //    done(err, user);
    //});
});

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'GiFkey/G[gBKhag[.Cm2TmPp{Rij3X)iHQcJvHEKMEK=&Xw44E'
}));

// Session-persisted message middleware

app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        if(username !== 'bob' && password !== 'secure') {
            return done(null, false, { message: 'Incorrect credentials.' });
        } else {
            console.log('Authenticated Successfully !');
            return done(null, {
                email: 'user@abc.com',
                name: 'Bogumil',
                id: 1
            });
        }
    }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Should be placed before express.static
// To ensure that all assets and data are compressed (utilize bandwidth)
app.use(compression({
    // Levels are specified in a range of 0 to 9, where-as 0 is
    // no compression and 9 is best compression, but slowest
    level: 9
}));

// Cross-origin resource sharing
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

// Only use logger for development environment
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve a static directory for the webpack-compiled Javascript and CSS. Only in production since the webpack dev server handles this otherwise.
if (process.env.NODE_ENV === "production") {app.use('/build', express.static(path.join(__dirname, '/build')));}

// Serves up a static directory for images and other assets that we don't (yet) require via Webpack
app.use('/public', express.static(path.join(__dirname, '/static')));


app.use('/', routes);

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

// development hot load for live editing
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        var hotLoadPort = process.env.HOT_LOAD_PORT || 8888;
        res.write('<script src="http://localhost:' + hotLoadPort + '/build/bundle.js" defer></script>');
    });
}

if (app.get('env') === 'production') {
    app.use(function(err, req, res, next) {
        res.write('<script src="/build/bundle.js" defer></script>');
    });
}

// Connect flash for flash messages
app.use(flash());

module.exports = app;
