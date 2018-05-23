let advanceBlock = require("./advanceBlock.js");

module.exports = function advanceBlocks(number) {
  return new Promise(async resolve => {
    let count = number;
    console.log(`-< Burning ${number} blocks *~+>`);
    while (--count > 0) {
      await advanceBlock();
    }
    console.log('-< complete !>-')
    resolve();
  });
}