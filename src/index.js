import './scss/style.scss';
import 'babel-polyfill';
import $ from 'jquery';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import navbar from './js/views/components/navbar';
import homePage from './js/views/pages/homePage';
import aboutPage from './js/views/pages/aboutPage';
import userPage from './js/views/pages/userPage';
import postPage from './js/views/pages/postPage';
import newPostPage from './js/views/pages/newPostPage';
import settingsPage from './js/views/pages/settingsPage';
import utils from './js/service/utils';
import './js/scripts/textarea-autoresize';
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
  '#/users/name/postname': postPage,
};

async function router() {
  const request = utils.parseUrl();
  const url = `#${
    request.resource ? `/${request.resource.slice(0, request.resource.indexOf('?') >= 0 ? request.resource.indexOf('?') : request.resource.length)}` : ''
  }${request.name ? '/name' : ''
  }${request.postName ? '/postname' : ''}`;
  const page = routes[url];
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
