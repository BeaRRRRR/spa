import utils from './../../service/utils'


const navbar = {
  render: async function () {
    let user = await utils.getAuthenticatedUser();
    return `<nav class="navbar navbar-expand-sm navbar-light bg-light">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a id="navbarHome" class="nav-link" href="#">Home</a>
                </li>
                <li>
                  <a id="navbarAbout" class="nav-link" href="#/about">About</a>
                </li>
                <li class="nav-item">
                  <a id="navbarAbout" class="nav-link" href="${user ? '#/users/${user.username}' : 'auth/google'}">${user ? 'User page' : 'Log in with google'}</a>
                </li>
                <li>
                  <a id="navbarNew" class="nav-link" href="#/new">Write a post</a>
                </li>
              </ul>
            </nav>
           `;
  },
  afterRender: async () => {
    // let url = utils.parseUrl();
    // if(url.name === 'new') $('#navbarNew').toggl
  }
};

export default navbar;
