import 'babel-polyfill';
import './css/style.css';
import homePage from './js/views/pages/homePage.js';
import aboutPage from './js/views/pages/aboutPage.js';
import userPage from './js/views/pages/userPage.js';
import postPage from './js/views/pages/postPage.js'
import utils from './js/service/utils.js';

// Log message to console
// logMessage('A very warm welcome to Expack!');
const routes = {
  '#': homePage,
  '#/about': aboutPage,
  '#/users/name': userPage,
  '#/users/name/postname' : postPage
};

async function router() {
  const content = document.getElementById('content');
  let request = utils.parseUrl();
  console.log(request);
  let url = '#' + (request.resource ? `/${request.resource}` : '') + (request.name ? `/name` : '') + (request.postName ? `/postname` : '');
  console.log(url);
  let page = routes[url];
  content.innerHTML = await page.render();
  await page.afterRender();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') {
  module.hot.accept(); // eslint-disable-line no-undef
}
