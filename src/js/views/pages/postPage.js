let postPage = {
  render: async function () {
    return `<a href="#">Home</a>
            <a href="#/about">About</a>
            <h1>This is the post page but there are no posts yet xD</h1>`;
  },
  afterRender: async () => {
  }
};

export default postPage;
