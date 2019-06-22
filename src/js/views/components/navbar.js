const getAuthenticatedUser = async () => {
  const response = await fetch('/getAuthenticatedUser');
  const json = await response.json();
  console.log(json);
  return json;
};

let navbar = {
  render: async function () {
    let user = await getAuthenticatedUser();
    return `<nav class="navbar navbar-expand-sm bg-light">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="#">Home</a>
                </li>
                <li>
                  <a class="nav-link" href="#/about">About</a>
                </li>
                <li class="nav-item">
                  ${user ? `<a class="nav-link" href="#/users/${user.username}">User page</a>` : '<a class="nav-link" href="auth/google">Log in with google</a>'} 
                </li>
              </ul>
            </nav>
           `;
  },
  afterRender: async () => {
  }
};

export default navbar;
