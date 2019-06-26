import $ from 'jquery';
import utils from '../../service/utils.js'

const getUser = async () => {
  let username = utils.parseUrl().name;
  let user = await $.get(`/api/v1/users/${username}`);
  return user;
};

let userPage = {
  render: async function () {
    let user = await getUser();
    return `<div class="card flex-row flex-wrap">
			        <div class="card-header border-0">
				        <img class="profile-pic" src="${user.avatar}" alt="well there must be a user avatar">
			        </div>
			        <div class="card-body">
			        	<h1 class="card-header">${user.name}</h1>
			        	<p class="card-text">${user.status ? user.status : 'No bio yet'}</p>
			         </div>
			         <a href="#/settings">Settings</a>
		        </div>`;

  },
  afterRender: async () => {
  }
};

export default userPage;
