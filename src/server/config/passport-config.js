import passport from 'passport';
import passportGoogleOAuth from 'passport-google-oauth';
import User from './../models/user';

const GoogleStrategy = passportGoogleOAuth.OAuth2Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(new GoogleStrategy({
    clientID: '20263739003-l210171qijqppm4u0a0uc3b1rndfq1gj.apps.googleusercontent.com',
    clientSecret: 'yZaL8LVUHh-39VCZbvNq0Ff8',
    callbackURL: 'http://localhost:8080/auth/google/callback'
  }, function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if (currentUser) {
        // already have this user
        console.log('user is: ', currentUser);
        done(null, currentUser);
      } else {
        console.log('The picture is ' + profile._json.picture);
        console.log('The picture  ' + profile.photos[0].value);
        // if not, create user in our db
        new User({
          email : profile._json.email,
          name: profile.displayName,
          username: profile._json.email.substring(0,profile._json.email.indexOf('@')),
          profileDescription : '',
          googleId: profile.id,
          avatar : profile._json.picture
        }).save().then((newUser) => {
          console.log('created new user: ', newUser);
          done(null, newUser);
        });
      }
    });
  }
));
