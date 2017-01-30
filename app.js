import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportFacebook from 'passport-facebook';

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'Digitzetre', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportFacebook.Strategy({
    clientID: 1626419137667563,
    clientSecret: '8e011ead49af90a5be8a9a2b593db6ba',
    callbackURL: '/',
    profileFields: ['id', 'emails', 'name', 'displayName']
  },
  (accessToken, refreshToken, profile, done) => {
    console.dir(profile);
    process.nextTick(() => {
      return done(null, profile);
    });
  }
));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', passport.authenticate('facebook'), (req, res) => {
  console.dir(req.user);
  if (req.user) {
    res.send(`
    <html>
      <body>
        <h2>Hello ${req.user.displayName}</h2>
        <a href="/logout">Logout</a>
      </body>
    </html>
    `);
  } else {
    res.send(`
    <html>
      <body>
        <div>
          <h2>Welcome! Please log in.</h2>
          <a href="/auth/facebook">Login from facebook</a>
        </div>
      </body>
    </html>
    `);
  }
});
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect : '/', 
    failureRedirect: '/login' 
  }),
  (req, res) => {
    res.redirect('/');
  });
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000);
console.log('Listening from 3000...');