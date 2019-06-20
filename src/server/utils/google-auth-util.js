import {google} from 'googleapis';

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId: '20263739003-l210171qijqppm4u0a0uc3b1rndfq1gj.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: 'yZaL8LVUHh-39VCZbvNq0Ff8', // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: 'http://localhost:8080/googleAuth', // this must match your google api settings
};

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];

/*************/
/** HELPERS **/

/*************/

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({version: 'v1', auth});
}

/**********/
/** MAIN **/

/**********/


const googleUtils = {

  urlGoogle: function () {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
  },

  getGoogleAccountFromCode: async function (code) {
    // const data = await auth.getToken(code);
    // const tokens = data.tokens;
    const auth = createConnection();
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    auth.setCredentials(tokens);
    const plus = getGooglePlusApi(auth);
    const me = await plus.people.get({userId: 'me'});
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    return {
      id: userGoogleId,
      email: userGoogleEmail,
      tokens: tokens,
    };
  }
};

export default googleUtils;
