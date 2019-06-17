import utils from '../../service/utils.js'

function getInfoAboutUser(){
  let nickname = utils.parseUrl().name;
  return nickname;
}

let userPage = {
  render: async function () {
    return `<a href="#">Home</a>
            <a href="#/about">About</a>
            <h1>This is the user's nickname is ${getInfoAboutUser()}</h1>`;
  },
  afterRender: async () => {
  }
};

export default userPage;
