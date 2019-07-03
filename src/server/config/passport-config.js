import passport from 'passport';
import passportGoogleOAuth from 'passport-google-oauth';
import UserRepository from '../service/user-repository';

const GoogleStrategy = passportGoogleOAuth.OAuth2Strategy;
const userRepository = new UserRepository();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userRepository.getById(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: '20263739003-l210171qijqppm4u0a0uc3b1rndfq1gj.apps.googleusercontent.com',
  clientSecret: 'yZaL8LVUHh-39VCZbvNq0Ff8',
  callbackURL: 'http://localhost:8080/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const currentUser = await userRepository.getByGoogleId(profile.id);
  if (currentUser) {
    // already have this user
    console.log('user is: ', currentUser);
    done(null, currentUser);
  } else {
    // if not, create user in our db
    const newUser = await userRepository.save({
      email: profile._json.email,
      name: profile.displayName,
      username: profile._json.email.substring(0, profile._json.email.indexOf('@')),
      profileDescription: '',
      googleId: profile.id,
      avatar: profile._json.picture,
    });
    done(null, newUser);
  }
}));
