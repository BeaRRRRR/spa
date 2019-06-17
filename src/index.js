import 'babel-polyfill';
import logMessage from './js/logger';
import './css/style.css';
import homePage from './js/pages/homePage.js';
import aboutPage from './js/pages/aboutPage.js';

// Log message to console
// logMessage('A very warm welcome to Expack!');
const routes = {
  '#/': homePage,
  '#/about': aboutPage
};

async function router() {
  console.log('pathname is ' + window.location.hash);
  let content = document.getElementById('content');
  let page = routes[window.location.hash];
  content.innerHTML = await page.render();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') {
  module.hot.accept(); // eslint-disable-line no-undef
}
