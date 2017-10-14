// import ether from './helpers/ether';
// import advanceBlock from './helpers/advanceBlock';
// import {increaseTimeTo, duration} from './helpers/increaseTime';
// import latestTime from './helpers/latestTime';
// import EVMThrow from './helpers/EVMThrow';

// const BigNumber = web3.BigNumber

// require('chai')
//   .use(require('chai-as-promised'))
//   .use(require('chai-bignumber')(BigNumber))
//   .should()

// const SplitPhaseDistribution = artifacts.require('./helpers/SplitPhaseDistribution.sol')
// const CinderToken = artifacts.require('CinderToken')

// contract('Regression Testing ::> Capped Crowdsale', function ([_, wallet]) {

//   const rate = new BigNumber(1000)

//   const cap = ether(300)
//   const lessThanCap = ether(60)

//   // const RATE = new BigNumber(100);
//   const RATE2 = new BigNumber(500);

//   // const CAP  = ether(8);
//   const CAP2  = ether(600);


//   before(async function() {
//     //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
//     await advanceBlock()
//   })

//   beforeEach(async function () {
//     this.startTime = latestTime() + duration.weeks(4);
//     this.endTime =   this.startTime + duration.weeks(4);
//     this.afterEndTime = this.endTime + duration.seconds(1);

//     this.secondaryStartTime = this.endTime + duration.weeks(4);
//     this.secondaryEndTime =   this.secondaryStartTime + duration.weeks(4);
//     this.afterSecondaryEndTime = this.secondaryEndTime + duration.seconds(1);

//     this.crowdsale = await SplitPhaseDistribution.new(this.startTime, this.endTime, this.secondaryStartTime, this.secondaryEndTime, rate, RATE2, cap, CAP2, wallet);
//     this.token = CinderToken.at(await this.crowdsale.token());
//   })

//   describe('creating a valid capped distribution', function () {

//     it('should fail with zero primary cap', async function () {
//       await SplitPhaseDistribution.new(this.startTime, this.endTime, this.secondaryStartTime, this.secondaryEndTime, rate, RATE2, 0, CAP2, wallet);
//     })

//     it('should fail with zero secondary cap', async function () {
//       await SplitPhaseDistribution.new(this.startTime, this.endTime, this.secondaryStartTime, this.secondaryEndTime, rate, RATE2, cap, 0, wallet);
//     })

//   });

//   describe('accepting payments', function () {

//     beforeEach(async function () {
//       await increaseTimeTo(this.startTime)
//     })

//     it('should accept payments within cap', async function () {
//       await this.crowdsale.send(cap.minus(lessThanCap)).should.be.fulfilled
//       await this.crowdsale.send(lessThanCap).should.be.fulfilled
//     })

//     it('should reject payments outside cap', async function () {
//       await this.crowdsale.send(cap)
//       await this.crowdsale.send(1).should.be.rejectedWith(EVMThrow)
//     })

//     it('should reject payments that exceed cap', async function () {
//       await this.crowdsale.send(cap.plus(1)).should.be.rejectedWith(EVMThrow)
//     })

//   })

//   describe('ending', function () {

//     beforeEach(async function () {
//       await increaseTimeTo(this.startTime)
//     })

//     it('should not be ended if under cap', async function () {
//       let hasEnded = await this.crowdsale.hasEnded()
//       hasEnded.should.equal(false)
//       await this.crowdsale.send(lessThanCap)
//       hasEnded = await this.crowdsale.hasEnded()
//       hasEnded.should.equal(false)
//     })

//     it('should not be ended if just under cap', async function () {
//       await this.crowdsale.send(cap.minus(1))
//       let hasEnded = await this.crowdsale.hasEnded()
//       hasEnded.should.equal(false)
//     })

//     it('should be ended if cap reached', async function () {
//       await this.crowdsale.send(cap)
//       let hasEnded = await this.crowdsale.hasEnded()
//       hasEnded.should.equal(true)
//     })

//   })

// })
