var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var OTC = artifacts.require("./OTC.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(OTC);
};
