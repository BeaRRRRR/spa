import express from 'express';
import passport from 'passport';

const authRouter = express.Router();

authRouter.route('/')
  .get(passport.authenticate('google', {
    // scope: ['https://www.googleapis.com/auth/plus.login']
    scope: ['profile', 'email']
  }));
authRouter.route('/callback')
  .get(passport.authenticate('google', {failureRedirect: '/login'}),function (req, res) {
    res.redirect('/')
  });

export default authRouter;
