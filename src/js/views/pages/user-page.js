import utils from '../../service/utils';
import UserRepository from '../../service/repositories/user-repository';

const userRepository = new UserRepository();

const userPage = {
  async render() {
    const [authenticatedUser, user] = await Promise.all([utils.getAuthenticatedUser(), userRepository.getByUsername(utils.parseUrl().name)]);
    return `<div class="card flex-row flex-wrap userpage">
              <div class="card-header">
                <img class="profile-pic" src="${user.avatar}" alt="well there must be a user avatar">
              </div>
              <div class="card-body">
                ${authenticatedUser._id === user._id ? ` 
                  <div class="userpage-buttons">
                    <a class="btn settings-button" role="button" href="#/settings">Settings</a>
                    <a class="btn btn-dark" role="button" href="auth/logout">Logout</a>
                  </div>` : ''}
                <h1 class="card-header user-profile-header">${user.name}</h1>
                <p class="card-text">${user.profileDescription ? user.profileDescription : 'No bio yet'}</p>
              </div>
            </div>`;
  },
  afterRender: async () => {
  },
};

export default userPage;
