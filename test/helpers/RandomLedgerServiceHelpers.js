const advanceBlock = require("./advanceBlock.js");
const advanceBlocks = require("./advanceBlocks.js");
const maturateChain = require("./maturateChain.js");
//
// contract helpers!
//
//
const openingTests = async (instance, config) => {
    const params = Object.assign({}, {
      gas: 210000,
      waitTime: 3,
      max: 255,
      cost: 20000000000000000
    }, config);

    // A. check user status (FALSE, FALSE)
    let isPending = await instance.isRequestPending.call(params.requestor, { from: params.from });
      assert.isFalse(isPending, "check pending number shouldn't be true");

    let canRevealInfo = await instance.canRevealInfo.call(params.requestor, { from: params.from });
      assert.isFalse(canRevealInfo[0], "can reveal shouldn't be true");

    // B. request number
    let requestNumberTxId = await instance.requestNumber.sendTransaction(params.requestor, parseInt(params.max, 10), parseInt(params.wait, 10), { from: params.from, value: params.value, gas: params.gas });
    let tx = await web3.eth.getTransaction(requestNumberTxId);
    let txr = await web3.eth.getTransactionReceipt(requestNumberTxId);
      assert.isFalse((txr.gasUsed === tx.gas), "transaction should not use all gas (fail)");

    isPending = await instance.isRequestPending.call(params.requestor, { from: params.from });
      assert.isTrue(isPending, "check pending number should be true");

    // return params for use in next test set
    let done = Promise.resolve(params);
    return done;
}

const advancementTests = async (instance, config) => {
    let canRevealInfo = null;
    let isPending = await instance.isRequestPending.call(config.requestor, { from: config.from });
      assert.isTrue(isPending, "check pending number should be true");

    // 3B. advance the blocks
    do {
      await advanceBlock();
      canRevealInfo = await instance.canRevealInfo.call(config.requestor, { from: config.from });

      // make sure states remain proper while waiting ... (*, TRUE)
      isPending = await instance.isRequestPending.call(config.requestor, { from: config.from });
      assert.isTrue(isPending, "check pending number should be true");
    } while (canRevealInfo[0] === false)

    // 4A. confirm states are proper (TRUE, TRUE)
    canRevealInfo = await instance.canRevealInfo.call(config.requestor, { from: config.from });
      assert.isTrue(canRevealInfo[0], "pending number is not ready to be revealed");
      // change to generation block?
      assert.strictEqual(canRevealInfo[1].toNumber(), 0, "wait blocks are not zeroed");
      assert.strictEqual(canRevealInfo[2].toNumber(), web3.eth.blockNumber, "reveal block is not current block number");

    isPending = await instance.isRequestPending.call(config.requestor, { from: config.from });
      assert.isTrue(isPending, "check pending number should be true");

    // return params for use in next test set
    let done = Promise.resolve(config);
    return done;
}

const closingTests = async (instance, config) => {

    // 3B. confirm states are proper (TRUE, TRUE)
    let isPending = await instance.isRequestPending.call(config.requestor, { from: config.from });
      assert.isTrue(isPending, "check pending number should be true");

    let canRevealInfo = await instance.canRevealInfo.call(config.requestor, { from: config.from });
      assert.isTrue(canRevealInfo[0], "requested number should still be pending");

    // 4B. reveal number
    let revealNumberTxId = await instance.revealNumber.sendTransaction(config.requestor, { from: config.from });
      tx = web3.eth.getTransaction(revealNumberTxId);
      txr = web3.eth.getTransactionReceipt(revealNumberTxId);

      assert.isFalse((txr.gasUsed === tx.gas), "transaction should not use all gas (fail)");


    // 5A. confirm states are proper (FALSE, FALSE)
    isPending = await instance.isRequestPending.call(config.requestor, { from: config.from });
      assert.isFalse(isPending, "check pending number should NOT be true");

    canRevealInfo = await instance.canRevealInfo.call(config.requestor, { from: config.from });
      assert.isFalse(canRevealInfo[0], "requested number should not still be pending");

    // return params for use in next test set
    let done = Promise.resolve(config);
    return done;
}


const validationTests = async (instance, config, previousResults) => {

    let rendered = await instance.getNumberInfo.call(config.requestor, { from: config.from });
      let generatedNumber = rendered[0].toNumber();

    // logs ...
    console.log(':: Random Number *~+> ', generatedNumber, config.max);
    if (previousResults[config.requestor]) { console.log('last number',  previousResults[config.requestor] ) };
    console.log('--- origin', rendered[2].toNumber());
    console.log('--- generation', rendered[3].toNumber());



    // return params for use in next test set
    let done = Promise.resolve(config);
    return done;
}

const watchLedgerRequested = async function (instance) {
  return new Promise((resolve, reject) => {
    let revealEvent = instance.EventRandomLedgerRequested({}, {fromBlock: 11, toBlock: 'latest'})
    revealEvent.watch(function (error, event) {
      if (error) {
        reject(error)
      } else if (event) {
        console.log('EventRandomLedgerRevealed - event', event)
        resolve(event)
      }
    })
  })
}

const watchLedgerReveals = async function (instance) {
  return new Promise((resolve, reject) => {
    let revealEvent = instance.EventRandomLedgerRevealed({}, {fromBlock: 11, toBlock: 'latest'})
    revealEvent.watch(function (error, event) {
      if (error) {
        reject(error)
      } else if (event) {
        console.log('EventRandomLedgerRevealed - event', event)
        resolve(event)
      }
    })
  })
}


module.exports = {
  openingTests,
  advancementTests,
  closingTests,
  validationTests,
  watchLedgerRequested,
  watchLedgerReveals
}
