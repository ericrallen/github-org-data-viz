
export default (repo, branch) => {
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/package.json`;

  fetch(url)
    .then((packageJson) => {
      console.log(packageJson);
    })
    .catch((error) => {
      console.error(error);
    })
  ;
};
