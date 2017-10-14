// const CinderToken = artifacts.require("./CinderToken.sol");
// const CinderTokenSale = artifacts.require("./CinderTokenSale.sol");

// module.exports = function(deployer) {
//   deployer.deploy(CinderToken);
//   // deployer.link(CinderToken, `CinderTokenSale`);
//   deployer.deploy(CinderTokenSale);
// };

// const CinderToken = artifacts.require("./CinderToken.sol");
const CinderTokenDistribution = artifacts.require("../contracts/CinderTokenDistribution");

module.exports = function(deployer) {
  // deployer.deploy(CinderToken);
  // deployer.link(CinderToken, CinderTokenDistribution);
  deployer.deploy(CinderTokenDistribution);
};
