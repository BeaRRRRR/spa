import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import 'babel-polyfill';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.dev.config.js';
import postRouter from './routes/api/v1/postRouter';
import googleAuthUtil from './utils/google-auth-util';

const db = mongoose.connect('mongodb://localhost/spa-db',{useNewUrlParser : true});

const app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, 'index.html'),
  compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  });
});
app.use('/api/v1/posts',postRouter);
app.get('/api/v1/googlelogin',(req,res) => {
 res.send(googleAuthUtil.urlGoogle());
});
app.get('/googleAuth',(req,res) => {
  console.log(req.query.code);
  console.log(googleAuthUtil.getGoogleAccountFromCode(req.query.code));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
});
