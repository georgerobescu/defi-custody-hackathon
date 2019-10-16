const {
  override,
  disableEsLint,
  addDecoratorsLegacy
} = require("customize-cra");
const { solidityLoader } = require("./config/webpack");

const overrideZeplin = (config, env) => {
  const scope = config.resolve.plugins.findIndex(
    o => o.constructor.name === "ModuleScopePlugin"
  );
  if (scope > -1) {
    config.resolve.plugins.splice(scope, 1);
  }
  config.module.rules.splice(config.module.rules - 2, 0, solidityLoader);
  return config;
};
module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  overrideZeplin
); /* config-overrides.js */
