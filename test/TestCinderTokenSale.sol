pragma solidity ^0.4.15;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CinderToken.sol";
import "../contracts/CinderTokenSale.sol";

contract TestCinderTokenSale {

  function testSaleHasOwnerOnCreation() {
    CinderTokenSale sale = CinderTokenSale(DeployedAddresses.CinderTokenSale());

    address expected = msg.sender;

    Assert.equal(sale.owner(), expected, "should have owner");
  }

  function testHasCinderToken() {
    CinderTokenSale sale = CinderTokenSale(DeployedAddresses.CinderTokenSale());

    CinderToken token = CinderToken(DeployedAddresses.CinderToken());

    Assert.equal(sale.token(), token, "should have CinderToken token");
  }

  // function testInitialBalanceUsingNewContract() {
  //   CinderToken meta = new CinderToken();

  //   uint256 expected = ((1 * (10 ** 9) * (10 ** 18)) * (100-60))/100;

  //   Assert.equal(meta.balanceOf(msg.sender), expected, "Owner should have 10000 CinderToken initially");
  // }


}
