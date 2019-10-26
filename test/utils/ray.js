const fs = require("fs-extra");

function copyRayBuilds() {
  let rayBuildsSource = `${__dirname}/../../contracts/rayartifacts/`;
  let builds = `${__dirname}/../../build/contracts/`;
  fs.copySync(rayBuildsSource, builds);
  try {
    fs.unlinkSync(`${builds}/.DS_Store`);
  } catch (e) {}
}

module.exports = {
  copyRayBuilds
};
