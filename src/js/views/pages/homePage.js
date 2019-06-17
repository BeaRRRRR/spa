let homePage = {
  render: async function () {
    return `<a href="#/about">About</a>
            <a href="#/users/mike">Our boi mikey here</a>
            <h1>There should be some posts</h1>`;
  },
  afterRender: async () => {
  }
};

export default homePage;
