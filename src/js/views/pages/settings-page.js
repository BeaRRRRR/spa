import $ from 'jquery';
import utils from '../../service/utils';
import UserRepository from '../../service/repositories/user-repository';

const userRepository = new UserRepository();
let user;

async function isUsernameAvaliable(username) {
  const users = await userRepository.getAll();
  return !users.some(user => user.username === username);
}

const settingsPage = {
  async render() {
    user = await utils.getAuthenticatedUser();
    return `<div class="container">
             <form id="settingsForm">
              <div class="form-group">
               <label for="username">Username</label>
               <input id="username" name="username" class="form-control" type="text" pattern=".{1,}" required title="1 character minimum" value="${user.username}">
              </div>
              <div class="form-group">
               <label for="name">Name</label>
               <input id="name" name="name" class="form-control" type="text" pattern=".{1,}" required title="1 character minimum" value="${user.name}">
              </div>
              <div class="form-group">
               <label for="profileDescription">Profile Description</label>
               <input id="profileDescription" name="profileDescription" class="form-control" type="text" value="${user.profileDescription}">
              </div>
              <button type="submit" class="btn btn-dark">Submit</button>
              <button id="cancel" type="button" class="btn btn-outline-dark">Cancel</button>
             </form>
            </div>`;
  },
  afterRender: async () => {
    $('#settingsForm').on('submit', async (event) => {
      console.log(user);
      event.preventDefault();
      const username = $('#username').val();
      console.log(username);
      const usernameAvaliable = await isUsernameAvaliable(username);
      if (usernameAvaliable || username === user.username) {
        const name = $('#name').val();
        const profileDescription = $('#profileDescription').val();
        await userRepository.update({
          _id: user._id,
          email: user.email,
          name,
          username,
          profileDescription,
          googleId: user.googleId,
          avatar: user.avatar,
        });
        window.location = `#/users/${username}`;
      } else {
        $('#username')[0].setCustomValidity('This username already exists');
      }
    });
    $('#cancel').on('click', () => {
      window.location = `#/users/${user.username}`;
    });
  },
};

export default settingsPage;
