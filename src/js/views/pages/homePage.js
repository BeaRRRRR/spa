async function getPosts() {
  const respone = await fetch('/api/v1/posts');
  const json = await respone.json();
  return json;
}


let homePage = {
  render: async function () {
    let posts = await getPosts();
    return `<div>
              <ul>
                ${posts.map(post => `<li><a href="#/users/${post.author}/${post._id}">${post.title}</a></li>`).join('\n')}
              </ul>
            </div>`;
  },
  afterRender: async () => {
  }
};

export default homePage;
