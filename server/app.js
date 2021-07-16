const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  cors = require('cors');

var app = express();

// Routes
const moviesRouter = require('./routes/movies');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.static(path.join(__dirname, './client/public')));

app.use(moviesRouter);

module.exports = app;
