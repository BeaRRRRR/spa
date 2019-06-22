const getProfile = async () => {
  const response = await fetch('/api/v1/profile');
  const json = await response.json();
  console.log(json);
  return json
};

let settingsPage = {
  render: async function() {
    let profile = await getProfile();
    return `<a href="#">Home</a>
            <a href="#/about">About</a>`;
  },
  afterRender: async () => {
  }
};

export default settingsPage;
