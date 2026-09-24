var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');

// Windows' terminal doesn't emit a POSIX SIGINT on Ctrl-C, so readline is
// used to detect it and re-emit SIGINT for the graceful shutdown handling
// registered in app_api/models/db.js to pick up.
if (process.platform === 'win32') {
  var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}

// Bring in the database (lives with the API now - separation of concerns)
require('./app_api/models/db');

var indexRouter = require('./app_server/routes/index');
var apiRouter = require('./app_api/routes/index');

var app = express();

// view engine setup - point Express at the app_server MVC views folder
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// register Handlebars partials (header, footer) so views can pull in {{> header}} / {{> footer}}
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// serve the static mockup assets (css, images, not-yet-converted .html pages);
// index: false so the '/' route below renders the templated home page instead of public/index.html
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.use('/', indexRouter);
// RESTful API endpoints (JSON) are served from the separate app_api application
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
