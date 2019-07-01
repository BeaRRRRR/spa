import $ from 'jquery';
import utils from '../../service/utils';
import userRepository from '../../service/repositories/user-repository';

const getUser = async () => {
  const username = utils.parseUrl().name;
  const user = await $.get(`/api/v1/users/?username=${username}`);
  return user;
};

const userPage = {
  async render() {
    const user = await userRepository.getByUsername(utils.parseUrl().name);
    return `<div class="card flex-row flex-wrap">
              <div class="card-header border-0">
                <img class="profile-pic" src="${user.avatar}" alt="well there must be a user avatar">
              </div>
              <div class="card-body">
                <h1 class="card-header">${user.name}</h1>
                <p class="card-text">${user.status ? user.status : 'No bio yet'}</p>
              </div>
              <a href="#/settings">Settings</a>
              <a href="auth/logout">Logout</a>
            </div>`;
  },
  afterRender: async () => {
  },
};

export default userPage;
