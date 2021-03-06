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
var moment = require('moment');

// Library
var Models = require('./models');

// Create app
var app = express();
var PORT = process.env.PORT || 3000;

// Set up view w. Handlebars
app.engine('handlebars', exphbs({ 
    defaultLayout: 'main',   
    helpers: {
      findLineBreaks: function (text_block) {
        text_block = text_block.replace(/(\r\n|\n|\r)/gm, '<br>');
        return text_block;
      },
    }
  })
);

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
app.use(methodOverride('_method'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('new story', function(msg){
    io.emit('new story', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// Requiring our routes
var LoginRoutes = require("./routes/LoginController.js");
app.use("/", LoginRoutes);

var ApiRoutes = require("./routes/api-routes.js");
app.use("/api", ApiRoutes);
// require("./routes/html-routes.js")(app);

var ApplicantRoutes = require("./routes/ApplicantController.js");
app.use("/applicant", ApplicantRoutes);

var CredentialRoutes = require("./routes/CredentialController.js");
app.use("/credential", CredentialRoutes);

var EmployerRoutes = require("./routes/EmployerController.js");
app.use("/employer", EmployerRoutes);

var JobRoutes = require("./routes/JobController.js");
app.use("/job", JobRoutes);

var MessageRoutes = require("./routes/MessageController.js");
app.use("/messaging", MessageRoutes);

var SearchRoutes = require("./routes/SearchController.js");
app.use("/search", SearchRoutes);

var NewsfeedRoutes = require("./routes/NewsfeedController.js");
app.use("/newsfeed", NewsfeedRoutes);

// Create Server
Models.sequelize.sync({ force: false }).then(function() {
  server.listen(PORT, function() {
    console.log(`Listening on PORT: ${PORT}`);
  });
});
