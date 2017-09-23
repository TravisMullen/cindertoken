pragma solidity ^0.4.15;

import './CinderToken.sol';

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
// library SafeMath {
//   function mul(uint256 a, uint256 b) internal constant returns (uint256) {
//     uint256 c = a * b;
//     assert(a == 0 || c / a == b);
//     return c;
//   }

//   function div(uint256 a, uint256 b) internal constant returns (uint256) {
//     // assert(b > 0); // Solidity automatically throws when dividing by 0
//     uint256 c = a / b;
//     // assert(a == b * c + a % b); // There is no case in which this doesn't hold
//     return c;
//   }

//   function sub(uint256 a, uint256 b) internal constant returns (uint256) {
//     assert(b <= a);
//     return a - b;
//   }

//   function add(uint256 a, uint256 b) internal constant returns (uint256) {
//     uint256 c = a + b;
//     assert(c >= a);
//     return c;
//   }
// }


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
// contract Ownable {
//   address public owner;


//   event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


//   /**
//    * @dev The Ownable constructor sets the original `owner` of the contract to the sender
//    * account.
//    */
//   function Ownable() {
//     owner = msg.sender;
//   }


//   /**
//    * @dev Throws if called by any account other than the owner.
//    */
//   modifier onlyOwner() {
//     require(msg.sender == owner);
//     _;
//   }


//   /**
//    * @dev Allows the current owner to transfer control of the contract to a newOwner.
//    * @param newOwner The address to transfer ownership to.
//    */
//   function transferOwnership(address newOwner) onlyOwner public {
//     require(newOwner != address(0));
//     OwnershipTransferred(owner, newOwner);
//     owner = newOwner;
//   }

// }
/**
 * @title Crowdsale
 * @dev Crowdsale is a base contract for managing a token crowdsale.
 * Crowdsales have a start and end timestamps, where investors can make
 * token purchases and the crowdsale will assign them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet
 * as they arrive.
 */
contract Crowdsale {
  using SafeMath for uint256;

  // The token being sold
  MintableToken public token;

  // start and end timestamps where investments are allowed (both inclusive)
  uint256 public startTime;
  uint256 public endTime;

  // address where funds are collected
  address public wallet;

  // how many token units a buyer gets per wei
  uint256 public rate;

  // amount of raised money in wei
  uint256 public weiRaised;

  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);


  function Crowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet) {
    require(_startTime >= now);
    require(_endTime >= _startTime);
    require(_rate > 0);
    require(_wallet != 0x0);

    token = createTokenContract();
    startTime = _startTime;
    endTime = _endTime;
    rate = _rate;
    wallet = _wallet;
  }

  // creates the token to be sold.
  // override this method to have crowdsale of a specific mintable token.
  function createTokenContract() internal returns (MintableToken) {
    return new MintableToken();
  }


  // fallback function can be used to buy tokens
  function () payable {
    buyTokens(msg.sender);
  }

  // low level token purchase function
  function buyTokens(address beneficiary) public payable {
    require(beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;

    // calculate token amount to be created
    uint256 tokens = weiAmount.mul(rate);

    // update state
    weiRaised = weiRaised.add(weiAmount);

    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

    forwardFunds();
  }

  // send ether to the fund collection wallet
  // override to create custom fund forwarding mechanisms
  function forwardFunds() internal {
    wallet.transfer(msg.value);
  }

  // @return true if the transaction can buy tokens
  function validPurchase() internal constant returns (bool) {
    bool withinPeriod = now >= startTime && now <= endTime;
    bool nonZeroPurchase = msg.value != 0;
    return withinPeriod && nonZeroPurchase;
  }

  // @return true if crowdsale event has ended
  function hasEnded() public constant returns (bool) {
    return now > endTime;
  }


}

/**
 * @title CappedCrowdsale
 * @dev Extension of Crowdsale with a max amount of funds raised
 */
contract CappedCrowdsale is Crowdsale {
  using SafeMath for uint256;

  uint256 public cap;

  function CappedCrowdsale(uint256 _cap) {
    require(_cap > 0);
    cap = _cap;
  }

  // overriding Crowdsale#validPurchase to add extra cap logic
  // @return true if investors can buy at the moment
  function validPurchase() internal constant returns (bool) {
    bool withinCap = weiRaised.add(msg.value) <= cap;
    return super.validPurchase() && withinCap;
  }

  // overriding Crowdsale#hasEnded to add cap logic
  // @return true if crowdsale event has ended
  function hasEnded() public constant returns (bool) {
    bool capReached = weiRaised >= cap;
    return super.hasEnded() || capReached;
  }

}


contract CinderTokenSale is CappedCrowdsale, Ownable {

  CinderToken public token;
  uint8 public constant INITIAL_START_TIME = uint8(1506016712); // December 1, 2017 12:00:00
  uint8 public constant INITIAL_END_TIME = uint8(1514696400); // December 31, 2017 00:00:00
  // uint8 public constant START_TIME = 1514826000; // January 1, 2018 12:00:00
  // uint8 public constant END_TIME = 1517374800; // January 31, 2018 00:00:00

  uint8 public constant INITIAL_RATE = uint8(1 * (10 ** 15)); // 1 CIN = .001 ETH
  uint256 public constant INITIAL_CAP = 1 * (10 ** 9) * (10 ** 18);
  
                                   // 
  event TokenRateAdjustment(uint256 exchangeRate);


  function CinderTokenSale (
    address _wallet
  )
    Crowdsale(INITIAL_START_TIME, INITIAL_END_TIME, INITIAL_RATE, _wallet)
    CappedCrowdsale(INITIAL_CAP)
  {
    owner = msg.sender;
  }


  // overriding Crowdsale#createTokenContract to add cap logic
  // @return MintableToken as CinderToken
  function createTokenContract() internal returns (MintableToken) {
    // put the tokens in the owners account until they are granted
    // 
    return new CinderToken();
  }

  function adjustRate(uint256 _rate) onlyOwner public returns (bool) {
    require(_rate > 0 || _rate != rate);

    rate = _rate;
    TokenRateAdjustment(rate);
    return true;
  }

  function changeWallet(address _wallet) onlyOwner public returns (bool) {
    require(_wallet != 0x0);

    wallet = _wallet;
    return true;
  }

  function reopenSale(uint256 _updatedCap, uint256 _startTime, uint256 _endTime) onlyOwner public returns (bool) {
    require(_startTime >= now);
    require(_endTime >= _startTime);
    require(_updatedCap > cap);

    // assume none can be sold between sales
    cap = cap.add(_updatedCap);
    startTime = _startTime;
    endTime = _endTime;
    token.reopenMinting(_updatedCap);
    return true;
  }
}
