import $ from 'jquery';
import utils from '../../service/utils';

const getAllUsers = async () => {
  const users = await $.get('/api/v1/users');
  console.log(users);
  return users;
};

const isUsernameAvaliable = async (username) => {
  const users = await getAllUsers();
  return !users.some(user => user.username === username);
};

const updateUser = async (user) => {
  const oldUser = await utils.getAuthenticatedUser();
  console.log(user);
  await $.ajax({
    url: `/api/v1/users/${oldUser._id}`,
    type: 'PUT',
    data: user,
    success(data) {
      console.log('Load was performed.');
      console.log(data);
    },
    // contentType : 'application/json'
  });
};

const aboutPage = {
  async render() {
    const user = await utils.getAuthenticatedUser();
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
    const user = await utils.getAuthenticatedUser();
    $('#settingsForm').on('submit', async (event) => {
      console.log(user);
      event.preventDefault();
      const username = $('#username').val();
      console.log(username);
      const usernameAvaliable = await isUsernameAvaliable(username);
      if (usernameAvaliable || username === user.username) {
        const name = $('#name').val();
        const profileDescription = $('#profileDescription').val();
        await updateUser({
          _id: user._id,
          email: user.email,
          name,
          username,
          profileDescription,
          googleId: user.googleId,
          avatar: user.avatar,
        });
      } else {
        $('#username')[0].setCustomValidity('This username already exists');
      }
    });
    $('#cancel').on('click', () => {
      window.location = `#/users/${user.username}`;
    });
  },
};

export default aboutPage;
