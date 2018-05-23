const advanceBlocks = require("./advanceBlocks.js");
const count = 256; // length of history

module.exports = function maturateChain(blockNumber) {
  return new Promise(async resolve => {
    if (blockNumber < count) {
      console.log(`Must "maturate the chain" by advancing it past its history cache limit (256 blocks) .+.+.+`);
      await advanceBlocks((count+1) - blockNumber);
      console.log('[finally] Done Burning.  *~+>');
    } else {
      console.log('Already a mature test chain, no need to pre-burn blocks. *~+>');
    }
    resolve();
  });
}