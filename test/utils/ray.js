const fs = require('fs-extra');

function copyRayBuilds() {
  let rayBuildsSource = `${__dirname}/../../contracts/rayartifacts/`;
  let builds = `${__dirname}/../../build/contracts/`;
  fs.copySync(rayBuildsSource, builds);
  fs.unlinkSync(`${builds}/.DS_Store`);
}

module.exports = {
  copyRayBuilds
}