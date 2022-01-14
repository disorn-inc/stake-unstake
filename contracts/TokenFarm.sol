// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    // stakeTokens
    // unstakeTokens
    // issueTokens
    // AddAllowedTokens
    // getValue

    // mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedMapping;
    address[] public stakers;
    address[] public allowedTokens;
    IERC20 public mockToken;
    // 100 ETH 1:1 for every 1 ETH, give 1 MockToken
    // 50 ETH and 50 DAI staked, and give a reward 1 MockToken / 1 DAI

    constructor(address _mockTokenAddress) public {
        mockToken = IERC20(_mockTokenAddress);
    }

    function setPriceFeedContract(address _token, address _priceFeed) public onlyOwner {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function stakeTokens(uint256 _amount, address _token) public {
        // what tokestakingBalance[_token][msg.sender]n user can stake?
        // how much user can stake?
        require(_amount > 0, "Amount much more than 0");
        require(tokenIsAllowed(_token), "Token is currently not allowed");
        // call tranferFrom
        // **tranfer use by owner wallet
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);
        stakingBalance[_token][msg.sender] = stakingBalance[_token][msg.sender] + _amount;
        if(uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        } 
    }

    function unstakeTokens(address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "Staking balance cannot be 0");
        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if(stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
    }

    function AddAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        for (uint256 allowedTokensIndex = 0; allowedTokensIndex < allowedTokens.length; allowedTokensIndex++) {
            if(_token == allowedTokens[allowedTokensIndex]) {
                return true;
            }
        }
        return false;
    }

    function issueTokens() public onlyOwner {
        for (uint256 stakersIndex = 0; stakersIndex < stakers.length; stakersIndex++) {
            address recipient = stakers[stakersIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            // send token reward based on their total value lock
            mockToken.transfer(recipient, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns(uint256) {
        uint256 totalValue = 0;
        require(uniqueTokensStaked[_user] > 0, "No token staked!");
        for (uint256 allowedTokensIndex = 0; allowedTokensIndex < allowedTokens.length; allowedTokensIndex++) {
            totalValue = totalValue + getUserSingleTokenValue(_user, allowedTokens[allowedTokensIndex]);
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token) public view returns(uint256) {
        // ex. user has stake 1 ETH -> 3900
        // return 3900
        // 200 DAI -> 200
        // return 200
        if(uniqueTokensStaked[_user] <= 0) {
            return 0;
        }
        // price of token * stakingBalance[_token][_user]
        (uint256 price, uint256 decimals) =  getTokenValue(_token);

        // 10 ETH
        // Ex. ETH/USD -> 100
        // 10 * 100 = 1,000
        return (stakingBalance[_token][_user] * price / 10**decimals);
    }

    function getTokenValue(address _token) public view returns(uint256, uint256) {
        // pricefeed
        address priceFeedAddresses = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddresses);
        (, int price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }
}