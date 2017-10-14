import ether from './helpers/ether';
import advanceBlock from './helpers/advanceBlock';
import {increaseTimeTo, duration} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMThrow from './helpers/EVMThrow';

// const ether = require('./helpers/ether');
// const {advanceBlock} = require('./helpers/advanceToBlock');
// const {increaseTimeTo, duration} = require('./helpers/increaseTime');
// const latestTime = require('./helpers/latestTime');
// const EVMThrow = require('./helpers/EVMThrow');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const SplitPhaseDistribution = artifacts.require('SplitPhaseDistribution');
const CinderToken = artifacts.require('CinderToken');

contract('SplitPhaseDistribution for CinderToken', function ([owner, wallet, investor]) {

  const RATE = new BigNumber(100);
  const RATE2 = new BigNumber(50);
  // const GOAL = ether(10);
  const CAP  = ether(8);
  const CAP2  = ether(12);

  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })

  beforeEach(async function () {
    this.startTime = latestTime() + duration.weeks(4);
    this.endTime =   this.startTime + duration.weeks(4);
    this.afterEndTime = this.endTime + duration.seconds(1);

    this.secondaryStartTime = this.endTime + duration.weeks(4);
    this.secondaryEndTime =   this.secondaryStartTime + duration.weeks(4);
    this.afterSecondaryEndTime = this.secondaryEndTime + duration.seconds(1);

    this.crowdsale = await SplitPhaseDistribution.new(this.startTime, this.endTime, this.secondaryStartTime, this.secondaryEndTime, RATE, RATE2, CAP, CAP2, wallet);
    this.token = CinderToken.at(await this.crowdsale.token());
  });

  it('should create crowdsale with correct parameters', async function () {
    this.crowdsale.should.exist;
    this.token.should.exist;

    (await this.crowdsale.startTime()).should.be.bignumber.equal(this.startTime);
    (await this.crowdsale.endTime()).should.be.bignumber.equal(this.endTime);

    (await this.crowdsale.secondaryStartTime()).should.be.bignumber.equal(this.secondaryStartTime);
    (await this.crowdsale.secondaryEndTime()).should.be.bignumber.equal(this.secondaryEndTime);

    (await this.crowdsale.rate()).should.be.bignumber.equal(RATE);
    (await this.crowdsale.wallet()).should.be.equal(wallet);
    (await this.crowdsale.cap()).should.be.bignumber.equal(CAP);
    (await this.crowdsale.secondaryCap()).should.be.bignumber.equal(CAP2);
  });

  // check has ended! (capp test?)

  // the primary phase
  it('should not accept payments before start of the primary phase', async function () {
    await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMThrow);
    await this.crowdsale.buyTokens(investor, {from: investor, value: ether(1)}).should.be.rejectedWith(EVMThrow);
    
  });

  it('isActive should be false before start of the primary phase', async function () {
    (await this.crowdsale.isActive()).should.equal(false);
    (await this.crowdsale.hasEnded()).should.equal(false);
  });

  it('should accept payments during the primary phase', async function () {
    const investmentAmount = ether(1);
    const expectedTokenAmount = RATE.mul(investmentAmount);

    await increaseTimeTo(this.startTime);
    await this.crowdsale.buyTokens(investor, {value: investmentAmount, from: investor}).should.be.fulfilled;

    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
  });
  it('isActive should be true after start of the primary phase', async function () {
    await increaseTimeTo(this.startTime);
    (await this.crowdsale.isActive()).should.equal(true);
    (await this.crowdsale.hasEnded()).should.equal(false);
  });

  it('isActive should be false if over cap', async function () {
    await increaseTimeTo(this.startTime);
    await this.crowdsale.send(CAP);
    (await this.crowdsale.isActive()).should.equal(false);
    (await this.crowdsale.hasEnded()).should.equal(true);
  });

  it('hasEnded should be true', async function () {
    await increaseTimeTo(this.startTime);
    await this.crowdsale.send(CAP);
    (await this.crowdsale.hasEnded()).should.equal(true);
  });

  it('should reject payments over cap', async function () {
    await increaseTimeTo(this.startTime);
    await this.crowdsale.send(CAP);
    await this.crowdsale.send(1).should.be.rejectedWith(EVMThrow);
  });

  it('isActive should be false if between primary and secondary phases', async function () {
    await increaseTimeTo(this.afterEnd);
    (await this.crowdsale.isActive()).should.equal(false);
  });
  it('hasEnded should be true if between primary and secondary phases', async function () {
    await increaseTimeTo(this.afterEnd);
    (await this.crowdsale.hasEnded()).should.equal(true);
  });

  // the primary and secondary intermediary
  it('should not accept payments between primary and secondary phases', async function () {
    await increaseTimeTo(this.afterEnd);
    await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMThrow);
    await this.crowdsale.buyTokens(investor, {value: ether(1), from: investor}).should.be.rejectedWith(EVMThrow);
  });

  // the secondary phase
  // 
  it('isActive should be false during the secondary phase', async function () {
    await increaseTimeTo(this.secondaryStartTime);
    (await this.crowdsale.isActive()).should.equal(true);
  });
  it('hasEnded should be trye during the secondary phase', async function () {
    await increaseTimeTo(this.secondaryStartTime);
    (await this.crowdsale.hasEnded()).should.equal(false);
  });
  it('should accept payments during the secondary phase', async function () {
    const investmentAmount = ether(1);
    const expectedTokenAmount = RATE2.mul(investmentAmount);

    await increaseTimeTo(this.secondaryStartTime);
    await this.crowdsale.buyTokens(investor, {value: investmentAmount, from: investor}).should.be.fulfilled;

    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
  });

  it('should reject payments after end the secondary phase', async function () {
    await increaseTimeTo(this.afterSecondaryEndTime);
    await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMThrow);
    await this.crowdsale.buyTokens(investor, {value: ether(1), from: investor}).should.be.rejectedWith(EVMThrow);
  });

  it('should reject payments over the secondary phase cap', async function () {
    await increaseTimeTo(this.secondaryStartTime);
    await this.crowdsale.send(CAP2);
    await this.crowdsale.send(1).should.be.rejectedWith(EVMThrow);
  });

  // should allocate percetange of tokens
  // 
  // // should be able to change rate for each

  // it('should allow finalization and transfer funds to wallet if the goal is reached', async function () {
  //   await increaseTimeTo(this.startTime);
  //   await this.crowdsale.send(GOAL);

  //   const beforeFinalization = web3.eth.getBalance(wallet);
  //   await increaseTimeTo(this.afterEndTime);
  //   await this.crowdsale.finalize({from: owner});
  //   const afterFinalization = web3.eth.getBalance(wallet);

  //   afterFinalization.minus(beforeFinalization).should.be.bignumber.equal(GOAL);
  // });

  // it('should allow refunds if the goal is not reached', async function () {
  //   const balanceBeforeInvestment = web3.eth.getBalance(investor);

  //   await increaseTimeTo(this.startTime);
  //   await this.crowdsale.sendTransaction({value: ether(1), from: investor, gasPrice: 0});
  //   await increaseTimeTo(this.afterEndTime);

  //   await this.crowdsale.finalize({from: owner});
  //   await this.crowdsale.claimRefund({from: investor, gasPrice: 0}).should.be.fulfilled;

  //   const balanceAfterRefund = web3.eth.getBalance(investor);
  //   balanceBeforeInvestment.should.be.bignumber.equal(balanceAfterRefund);
  // });

});
