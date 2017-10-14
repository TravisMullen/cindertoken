const advanceBlock = require("./advanceBlock.js");

// Advances the block number so that the last mined block is `number`.
module.exports = async function advanceToBlock(number) {
  if (web3.eth.blockNumber > number) {
    throw Error(`block number ${number} is in the past (current is ${web3.eth.blockNumber})`)
  }

  while (web3.eth.blockNumber < number) {
    await advanceBlock()
  }
}