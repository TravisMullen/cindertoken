const accounts = [0x123,0x003,0x213,0x214];
const MultiSigWalletFactory = artifacts.require("../contracts/MultiSigWalletFactory");
const CinderTokenDistribution = artifacts.require("../contracts/CinderTokenDistribution");

module.exports = async function(deployer, network, accounts) {
	console.log('network: ', network);
  // let signers;
  // let createWallet;
  // let MultiSigWalletContract;
  // 	console.log('network.accounts', network.accounts, accounts);
  // if (network == "live") {
  //   signers = network.accounts; // accounts in truffle.js
  // } else {
  //   signers = accounts;
  // }

  // try {
  // 	const MultiSigWalletContract = await deployer.deploy(MultiSigWalletFactory);
  // 	console.log('MultiSigWalletContract', MultiSigWalletContract);
		// const createWallet = await MultiSigWalletFactory(MultiSigWalletContract).create(signers, 3);
  // 	console.log('createWallet', createWallet);
  // } catch (err) {
  // 	console.log(err);
  // 	throw err;
  // }

  let CinderTokenContract = await deployer.deploy(CinderTokenDistribution);
};
