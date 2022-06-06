//  dotenv for use of environment variables
// require('dotenv').config();

const path = require('path');

// models?
// const models = require('./models');

const express = require('express');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const routes = require('./controllers');
const sequelize = require('./config/connection');

// configuration for express sessions
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: process.env.SESSION_SECRET,

  // set session timeout to 30 minutes
  cookie: {
    expires: 30 * 60 * 1000,
  },
  // resaves the cookie on update
  resave: true,
  // resets the expiration on update
  rolling: true,
  // will not save cookie unless modified in some way
  saveUninitialized: false,
  // store cookie in Sequelize/SQL as well as on browser
  store: new SequelizeStore({
    db: sequelize,
  }),
};

const app = express();
const PORT = process.env.PORT || 3001;

// middleware for handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// required to handle data streams
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sets up a static path for html/css code to be served
app.use(express.static(path.join(__dirname, '/public/')));

// middleware for express session
app.use(session(sess));

app.use(routes);



sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening at http://localhost"${PORT}'));
});