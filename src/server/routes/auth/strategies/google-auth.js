import express from 'express';
import passport from 'passport';

const googleAuthRouter = express.Router();

googleAuthRouter.route('/')
  .get(passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));
googleAuthRouter.route('/callback')
  .get(passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
  });

export default googleAuthRouter;
