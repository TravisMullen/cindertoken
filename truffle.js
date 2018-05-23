require('babel-register');
require('babel-polyfill');

// var provider;
// var HDWalletProvider = require('truffle-hdwallet-provider');
// var mnemonic = '[REDACTED]';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    live: {
      host: "localhost",
      port: 8545,
      network_id: "1", // Match main
      accounts: [0x123, 0x234,0x2345,0x256]
    }
  }
};
