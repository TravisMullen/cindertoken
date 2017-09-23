// const CinderToken = artifacts.require("./CinderToken.sol");
// const CinderTokenSale = artifacts.require("./CinderTokenSale.sol");

// module.exports = function(deployer) {
//   deployer.deploy(CinderToken);
//   // deployer.link(CinderToken, `CinderTokenSale`);
//   deployer.deploy(CinderTokenSale);
// };

var CinderToken = artifacts.require("./CinderToken.sol");
var CinderTokenSale = artifacts.require("./CinderTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(CinderToken);
  deployer.link(CinderToken, CinderTokenSale);
  deployer.deploy(CinderTokenSale);
};
