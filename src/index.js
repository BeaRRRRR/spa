import './scss/style.scss';
import 'babel-polyfill';
import $ from 'jquery';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import navbar from './js/views/components/navbar';
import homePage from './js/views/pages/home-page';
import aboutPage from './js/views/pages/about-page';
import userPage from './js/views/pages/user-page';
import postPage from './js/views/pages/post-page';
import newPostPage from './js/views/pages/new-post-page';
import settingsPage from './js/views/pages/settings-page';
import utils from './js/service/utils';
import './js/scripts/textarea-autoresize';


const routes = {
  '#': homePage,
  '#/settings': settingsPage,
  '#/new': newPostPage,
  '#/about': aboutPage,
  '#/users/name': userPage,
  '#/users/name/postname': postPage,
};

async function router() {
  const request = utils.parseUrl();
  const url = `#${
    request.resource ? `/${request.resource.slice(0, request.resource.indexOf('?') >= 0 ? request.resource.indexOf('?') : request.resource.length)}` : ''
  }${request.name ? '/name' : ''
  }${request.postName ? '/postname' : ''}`;
  console.log(url);
  const page = routes[url];
  $('#content').html(await page.render());
  $('#navbar').html(await navbar.render());
  await Promise.all([page.afterRender(), navbar.afterRender()]);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
$.ajaxSetup({
  async: true,
});
// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') {
  module.hot.accept(); // eslint-disable-line no-undef
}
