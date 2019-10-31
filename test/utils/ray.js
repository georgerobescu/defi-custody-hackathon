const fs = require("fs-extra");

function copyRayBuilds() {
  let rayBuildsSource = `${__dirname}/../../contracts/rayartifacts/`;
  let builds = `${__dirname}/../../build/contracts/`;
  fs.copySync(rayBuildsSource, builds);
  //In order to run on windows surrounded with try catch
  try {
    fs.unlinkSync(`${builds}/.DS_Store`);
  } catch (e) {}
}

module.exports = {
  copyRayBuilds
};
