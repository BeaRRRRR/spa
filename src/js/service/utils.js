const utils = {
  parseUrl: function () {
    let url = window.location.hash.slice(2).split('/');
    const parsedUrl = {
      resource: url[0],
      name: url[1],
      postName: url[2]
    };
    return parsedUrl;
  },
  removeAllWhitespaces: function (str) {
    str = str.replace(/\s+/g, '');
  }
};

export default utils;
