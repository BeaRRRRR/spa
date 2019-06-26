import $ from 'jquery';
import utils from '../../service/utils';

const getAllUsers =async () => {
  let users = await $.get('/api/v1/users');
  console.log(users);
  return users;
};

const isUsernameAvaliable = async (username) => {
  let  users = await getAllUsers();
  return !users.some(user => user.username === username);
};

const updateUser = async (user) => {
  let oldUser = await utils.getAuthenticatedUser();
  console.log(user);
  await $.ajax({
    url: `/api/v1/users/${oldUser.username}`,
    type: 'PUT',
    data: user,
    success: function (data) {
      console.log('Load was performed.');
      console.log(data);
    }
    // contentType : 'application/json'
  });
};

let aboutPage = {
  render: async function () {
    let user = await utils.getAuthenticatedUser();
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
    let user =await utils.getAuthenticatedUser();
    $('#settingsForm').on('submit', async function (event) {
      console.log(user);
      event.preventDefault();
      let username = $('#username').val();
      console.log(username);
      let usernameAvaliable = await isUsernameAvaliable(username);
      if(usernameAvaliable || username === user.username) {
        let name = $('#name').val();
        let profileDescription = $('#profileDescription').val();
        await updateUser({
          _id: user._id,
          email: user.email,
          name: name,
          username: username,
          profileDescription: profileDescription,
          googleId: user.googleId,
          avatar: user.avatar
        });
      }else {
        $('#username')[0].setCustomValidity('This username already exists');
      }
    });
    $('#cancel').on('click',function () {
      window.location = `#/users/${user.username}`
    })
  }
};

export default aboutPage;
