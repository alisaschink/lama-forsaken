// Dependencies
var express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var passport = require("./config/passport");
const path = require('path');
const multer = require('multer');
var exphbs = require('express-handlebars');

// Library
var Models = require('./models');

// Create app
var app = express();
var PORT = process.env.PORT || 3000;

// Set up view w. Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Middleware
app.use(session({
  secret: 'app',
  cookie: { maxAge: 6 * 1000 * 1000 * 1000 * 1000 },
  resave: true,
  saveUninitialized: true,
}));
app.use(cookieParser());

// Make session available;
app.use(function(req, res, next) {
  res.locals.request = req;
  if (req.session != null && req.session.user_id != null) {
    res.locals.user = req.session.username;
    // res.locals.user = req.session.username; // user id
    res.locals.logged_in = true;
  }
  next(null, req, res);
});

app.use(express.static(path.join(process.cwd(), '/public')));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);


// Create Server
Models.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log(`Listening on PORT: ${PORT}`);
  });
});