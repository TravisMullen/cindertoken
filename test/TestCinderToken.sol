pragma solidity ^0.4.15;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CinderToken.sol";

contract TestCinderToken {

  function testInitialBalanceUsingDeployedContract() {
    CinderToken token = CinderToken(DeployedAddresses.CinderToken());

    uint256 expected = ((1 * (10 ** 9) * (10 ** 18)) * (100-60))/100;

    Assert.equal(token.balanceOf(msg.sender), expected, "Owner should have 10000 CinderToken initially");
  }

  function testTokenHasOwnerOnCreation() {
    CinderToken token = CinderToken(DeployedAddresses.CinderToken());

    address expected = msg.sender;

    Assert.equal(token.owner(), expected, "should have owner");
  }
  // function testInitialBalanceUsingNewContract() {
  //   CinderToken token = new CinderToken();

  //   uint256 expected = ((1 * (10 ** 9) * (10 ** 18)) * (100-60))/100;

  //   Assert.equal(token.balanceOf(msg.sender), expected, "Owner should have 10000 CinderToken initially");
  // }


}
