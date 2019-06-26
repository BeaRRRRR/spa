import './scss/style.scss';
import 'babel-polyfill';
import $ from 'jquery';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import navbar from './js/views/components/navbar.js';
import homePage from './js/views/pages/homePage.js';
import aboutPage from './js/views/pages/aboutPage.js';
import userPage from './js/views/pages/userPage.js';
import postPage from './js/views/pages/postPage.js';
import newPostPage from './js/views/pages/newPostPage.js';
import settingsPage from './js/views/pages/settingsPage';
import utils from './js/service/utils.js';
import './js/scripts/textarea-autoresize.js';
// import fontawesome from '@fortawesome/fontawesome';
// import regular from '@fortawesome/free-regular-svg-icons';
// import solid from '@fortawesome/free-solid-svg-icons';
// import brands from '@fortawesome/free-brands-svg-icons';
//
// fontawesome.library.add(regular);
// fontawesome.library.add(solid);
// fontawesome.library.add(brands);

const routes = {
  '#': homePage,
  '#/settings': settingsPage,
  '#/new': newPostPage,
  '#/about': aboutPage,
  '#/users/name': userPage,
  '#/users/name/postname': postPage
};

async function router() {
  let request = utils.parseUrl();
  let url = '#' + (request.resource ? `/${request.resource}` : '') + (request.name ? `/name` : '') + (request.postName ? `/postname` : '');
  let page = routes[url];
  $('#navbar').html(await navbar.render());
  await navbar.afterRender();
  $('#content').html(await page.render());
  await page.afterRender();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') {
  module.hot.accept(); // eslint-disable-line no-undef
}
