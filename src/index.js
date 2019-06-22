import './scss/style.scss';
import 'babel-polyfill';
import $ from 'jquery';
import navbar from './js/views/components/navbar.js';
import homePage from './js/views/pages/homePage.js';
import aboutPage from './js/views/pages/aboutPage.js';
import userPage from './js/views/pages/userPage.js';
import postPage from './js/views/pages/postPage.js';
import utils from './js/service/utils.js';

const routes = {
  '#': homePage,
  '#/about': aboutPage,
  '#/users/name': userPage,
  '#/users/name/postname': postPage
};

async function router() {
  const content = document.getElementById('content');
  const header = $('#navbar');
  let request = utils.parseUrl();
  let url = '#' + (request.resource ? `/${request.resource}` : '') + (request.name ? `/name` : '') + (request.postName ? `/postname` : '');
  let page = routes[url];
  header.html(await navbar.render());
  await navbar.afterRender();
  content.innerHTML = await page.render();
  await page.afterRender();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') {
  module.hot.accept(); // eslint-disable-line no-undef
}
