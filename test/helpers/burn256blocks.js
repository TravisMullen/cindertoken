const advanceBlocks = require("./advanceBlocks.js");
const count = 256; // length of history

module.exports = function burn256blocks() {
  return new Promise(async resolve => {
    if (web3.eth.blockNumber < count) {
      console.log(`Burning ${count - web3.eth.blockNumber} blocks, so please be patient .+.+.+`);
      await advanceBlocks(count - web3.eth.blockNumber);
      console.log('[finally] Done Burning');
    } else {
      console.log('Already a mature test chain, no need to pre-burn blocks. *~+>');
    }
    resolve();
  });
}
// module.exports = function burn256() {
//   console.log('Burning 256 blocks, so please be patient => Target: No.', blockToBurn.length + web3.getBlockNumber());
  
//   let blockToBurn = [];
//   let logs = [];
//   while (blockToBurn.length < 256) {
//     blockToBurn.push(advanceBlock);
//   }

//   // advance 256 blocks (to test expired block.hash()
//   return blockToBurn.reduce((promise, advBlockFn) => {
//     return promise
//       .then((result) => {
//         return advBlockFn();
//       })
//       .catch(console.error);
//   }, Promise.resolve());  

//   console.log('[finally] Done Burning');
// }
