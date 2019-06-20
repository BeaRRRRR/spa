async function getPosts() {
  const respone = await fetch('/api/v1/posts');
  const json = await respone.json();
  return json;
}

async function getGoogleLoginUrl(){
  const response = await fetch('/api/v1/googlelogin');
  const json = await response.text();
  console.log(json);
  return json;
}

let homePage = {
  render: async function () {
    let posts = await getPosts();
    let loginUrl = await getGoogleLoginUrl();
    console.log(posts[0].id);
    console.log(posts[0]._id);
    return `<div>
              <ul>
                ${posts.map(post => `<li><a href="#/users/${post.author}/${post._id}">${post.title}</a></li>`).join('\n')}
              </ul>
            </div>
            <a href="#/about">About</a>
            <a href="${loginUrl}">Login with google</a>`;
  },
  afterRender: async () => {
  }
};

export default homePage;
