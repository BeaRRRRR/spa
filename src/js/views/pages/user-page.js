import utils from '../../service/utils';
import UserRepository from '../../service/repositories/user-repository';

const userRepository = new UserRepository();

const userPage = {
  async render() {
    const authenticatedUser = utils.getAuthenticatedUser();
    const user = await userRepository.getByUsername(utils.parseUrl().name);
    return `<div class="card flex-row flex-wrap userpage">
              <div class="card-header">
                <img class="profile-pic" src="${user.avatar}" alt="well there must be a user avatar">
              </div>
              <div class="card-body">
                <h1 class="card-header user-profile-header">${user.name}</h1>
                <p class="card-text">${user.profileDescription ? user.profileDescription : 'No bio yet'}</p>
              </div>
              ${authenticatedUser ? ` 
                <a class="btn btn-dark setting-button" href="#/settings">Settings</a>
                <a href="auth/logout">Logout</a>
              ` : ''}
            </div>`;
  },
  afterRender: async () => {
  },
};

export default userPage;
