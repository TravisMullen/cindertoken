/**
 * To show diversity within repetitions when logging similar content. Will animate the change over time.
 * @param {number} dynamicNumber - Any number value that will be unique for each function call. 
 * @return {string} To be used as console.log(`${animateLogs( ++someNumber )}`)
 */
function animateLogs(dynamicNumber) {
  let glyphs = ['o','+','*','^','~'];
  let count = dynamicNumber % 10;
  let sprites = [];
  do {
    sprites.push(`${glyphs[ count % (glyphs.length - 1) ]}` );
  } while (--count > 0);
  return sprites.join(' . ');
}

module.exports = function advanceBlock() {
  return new Promise(resolve => {
    web3.currentProvider.sendAsync({
      method: "evm_mine",
      jsonrpc: "2.0",
      id: new Date().getTime()
    }, function (error, result) {
      if (error) {
        console.log(`\tCould not advance block :: `, error);
      } else {
        if (web3.eth.blockNumber % (256/16) === 0) {
          console.log(`.`);
        }
        if (web3.eth.blockNumber % (256/4) === 0) {
          console.log(`
            ${web3.eth.blockNumber} - ${animateLogs(web3.eth.blockNumber)}`);

      // let wolf = await instance._now.call();
      // console.log('wolf', wolf[0].toNumber(), wolf[0].toNumber());
          // console.log('this', this)
        }
        resolve(result);
      }
    });
  });
}
