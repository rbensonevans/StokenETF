// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/IERC20.sol";

/**
 * @title StokenETFManager
 * @dev Invest in DeFiFund; Swap GHO tokens for DefiFund tokens.
 */
contract StokenETFManager {

    address private owner;
    address public see_owner; // for debugging.

    uint public sequenceNumber;

    struct GHO_TokenVault {
        uint ghoTotalAmount; // should be kept in sync with amount on the blockchain.
        address companyGHOVaultAddress; // the company's vault on the GHO token.
    }

    struct ETF_Fund {
        string fundId;   // short name (up to 32 bytes)
        uint maxAllocation; // current allocation size; fund amount is expandable via minting/updating.
        uint currentSupply; // current amount available; pre-minted amount; initially same as maxAllocation.
        uint currentPrice; // fund's current weighted price in USD; retrieved from an Oracle; underlying is priced in USD.
        string currencyType; // currency the fund is priced-in and fees charged-in; default USD. 
        uint buyFee; // fee amount charged on buying.
        uint sellFee; // fee amount charged on selling.
        uint totalBuyFeeAmount; // earnings; accumulated total in buy fees.
        uint totalSellFeeAmount; // earnings; accumulated total in sell fees.
        GHO_TokenVault GHO_tokenManager; // tracks amount and token-address of GHO allocated to each fund.
        mapping(address => uint) investorsMap; // track fund investors and their ownership amounts.
    }

    struct ETF_TokenContracts {
        IERC20 stableCoin; // the user's coin.
        IERC20 etfCoin; // the etf's coin.
    }
  
    mapping(uint => ETF_Fund) private ETF_SET; // a set of ETF funds by id.
    mapping(string => uint) private ETF_ByName; // refer to ETF funds by name.
    mapping(string => ETF_TokenContracts) private ETF_Tokens; // refer by name.


    // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        //console.log("Owner contract deployed by: ", msg.sender);
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        sequenceNumber = 10000; // start at a bigger than zero number; first fund starts at 10001. 
        see_owner =  msg.sender; // REMOVE LATER. FOR DEBUGGING ONLY!!       
    }

    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }

    /**
     * @dev copied Tokenswap from https://solidity-by-example.org/app/erc20/.
     */
    function tokenSwap (IERC20 _token1, address _owner1, uint _amount1, IERC20 _token2, address _owner2, uint _amount2) private {
        IERC20 token1;
        IERC20 token2;
  
        token1 = IERC20(_token1);
        token2 = IERC20(_token2);

        require(msg.sender == _owner1 || msg.sender == _owner2, "Not authorized");
        require(
            token1.allowance(_owner1, address(this)) >= _amount1,
            "Token 1 allowance too low"
        );
        require(
            token2.allowance(_owner2, address(this)) >= _amount2,
            "Token 2 allowance too low"
        );

        _safeTransferFrom(token1, _owner1, _owner2, _amount1);
        _safeTransferFrom(token2, _owner2, _owner1, _amount2);
    }

    /**
     * @dev copied Tokenswap from https://solidity-by-example.org/app/erc20/.
     */
    function _safeTransferFrom(IERC20 token, address sender, address recipient, uint amount) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }


    /**
     * @dev Create an ETF and return its fund id.
     * @return value of the ETF'S fund id.
     */
    function createETF(string memory _fundName, uint _maxAllocation, uint _buyFee, uint _sellFee, address GHO_token) public returns (uint) {
        sequenceNumber += 25; // arbitrary; increment by more than 1.
        ETF_ByName[_fundName] = sequenceNumber; // map name to fund's id.
        ETF_SET[sequenceNumber].fundId = _fundName;
        ETF_SET[sequenceNumber].maxAllocation = _maxAllocation;
        ETF_SET[sequenceNumber].currentSupply = _maxAllocation;
        ETF_SET[sequenceNumber].currentPrice = 0;
        ETF_SET[sequenceNumber].currencyType = "USD";
        ETF_SET[sequenceNumber].buyFee = _buyFee;
        ETF_SET[sequenceNumber].sellFee = _sellFee;
        ETF_SET[sequenceNumber].totalBuyFeeAmount = 0;
        ETF_SET[sequenceNumber].totalSellFeeAmount = 0;
        ETF_SET[sequenceNumber].GHO_tokenManager.ghoTotalAmount = 0; // can be assumed to be 0.
        ETF_SET[sequenceNumber].GHO_tokenManager.companyGHOVaultAddress = GHO_token; // this should be a valid GHO token address.
              
        return(sequenceNumber); // the fund's id.
    }

     /**
     * @dev set token addresses.
     */
     function setTokenContractAddress(string memory _fundName, IERC20 _stablecoin, IERC20 _etfcoin) public {
        ETF_Tokens[_fundName].stableCoin = _stablecoin;
        ETF_Tokens[_fundName].etfCoin = _etfcoin;
     }  

    /**
     * @dev Return ETF's real-time price.
     * @return value of the ETF'S current price.
     */
    function oracleGetETFPrice(string memory _fundName) public returns (uint){
        // Hardcoded for now: 5 underlying tokens priced in USD with an equal weighting of 20%. 
        // uint weightedPrice = (101.13 + 56.44 + 0.46 + 6.71 + 3.57) * .20; // should call something like ETFOracle_GetPrice(_fundName, currencyType);
        uint weightedPrice = 16742770167427703; // 33 USD.
        ETF_SET[ETF_ByName[_fundName]].currentPrice = weightedPrice; // this price is in currencyType (default: USD).
        return weightedPrice;
    }

    /**
     * @dev Return GHO to currencyType (default: USD) real-time conversion rate.
     * @return value of the GHO/currencyType conversion rate.
     */
    function oracleGetGHOConversionRate(string memory _currencyType) public pure returns (uint) {
        // Hardcoded for now: 5 underlying tokens priced in USD with an equal weighting of 20%. 
        uint conversionRate = 1; // 1 GHO equals 1 USD; ideally, ETFOracle_GetConversionRate("GHO", _currencyType);
        return conversionRate; // this is the GHO to currencyType (ex. USD) conversion rate.
    }

    /**
     * @dev Buy _investGHOTokenAmount of some ETF.
     * @return number of tokens or token units bought.
     */
    function buyETFToken(string memory _fundName, uint _investGHOTokenAmount, address transferFromGHOAddress) public returns (uint) {

        uint buyFee = ETF_SET[ETF_ByName[_fundName]].buyFee;
        string memory currencyType = ETF_SET[ETF_ByName[_fundName]].currencyType;      
        uint currentGHOtoCCYRate = oracleGetGHOConversionRate(currencyType);

        uint _realBuyAmount = (_investGHOTokenAmount * currentGHOtoCCYRate) - buyFee; // Fees in currencyType.
        uint _ETFTokenAmount = _realBuyAmount / getETFWeightedPrice(_fundName);

        require (ETF_SET[ETF_ByName[_fundName]].currentSupply >= _ETFTokenAmount, "Failure; Fund fully allocated."); 

        ETF_SET[ETF_ByName[_fundName]].currentSupply -= _ETFTokenAmount;
        ETF_SET[ETF_ByName[_fundName]].totalBuyFeeAmount += buyFee;
        ETF_SET[ETF_ByName[_fundName]].investorsMap[msg.sender] += _ETFTokenAmount;

        IERC20 stableCoin = ETF_Tokens[_fundName].stableCoin; // user's coin address.
        IERC20 etfCoin = ETF_Tokens[_fundName].etfCoin; // etf's coin.
        stableCoin.approve(msg.sender, _investGHOTokenAmount);
        etfCoin.approve(owner, _ETFTokenAmount);
        tokenSwap (stableCoin, msg.sender, _investGHOTokenAmount, etfCoin, owner, _ETFTokenAmount);
        return _ETFTokenAmount;
    }

    /**
     * @dev Return pool id.
     * @return value of pool id.
     */
    function sellETFToken(string memory _fundName, uint _sellETFAmount, address sendtoUserGHOAddress) public returns (uint){
        require(ETF_SET[ETF_ByName[_fundName]].investorsMap[msg.sender] != 0, "Failure: You do not have an account");

        uint sellersRealTokenAmount = ETF_SET[ETF_ByName[_fundName]].investorsMap[msg.sender];

        require(sellersRealTokenAmount >= _sellETFAmount, "Failure; insufficient tokens"); 

        ETF_SET[ETF_ByName[_fundName]].investorsMap[msg.sender] -= _sellETFAmount;
        ETF_SET[ETF_ByName[_fundName]].currentSupply += _sellETFAmount;

        uint _sellersValue = _sellETFAmount * getETFWeightedPrice(_fundName); // number_of_tokens * ETF's price in currencyType.

        uint sellFee = ETF_SET[ETF_ByName[_fundName]].sellFee;
        uint _realSellersValue = _sellersValue - sellFee; // sell feee is in currencyType.
        ETF_SET[ETF_ByName[_fundName]].totalSellFeeAmount += sellFee;

        // convert to GHO
        string memory currencyType = ETF_SET[ETF_ByName[_fundName]].currencyType;      
        uint _ghoTokenAmount = _realSellersValue / oracleGetGHOConversionRate(currencyType);

        ETF_SET[ETF_ByName[_fundName]].GHO_tokenManager.ghoTotalAmount -= _ghoTokenAmount;

        IERC20 stableCoin = ETF_Tokens[_fundName].stableCoin; // user's coin address.
        IERC20 etfCoin = ETF_Tokens[_fundName].etfCoin; // etf's coin.
        stableCoin.approve(msg.sender, _ghoTokenAmount);
        etfCoin.approve(owner, _sellETFAmount);
        tokenSwap (etfCoin, msg.sender, _sellETFAmount, stableCoin, owner, _ghoTokenAmount);

        return _ghoTokenAmount; // amount of GHO tokens returned.
    }

    /**
     * @dev Return fund's total GHO amount.
     * @return fund's total GHO amount.
     */
    function getETFGHOTotalAmount(string memory _fundName) public view returns (uint) {
        return ETF_SET[ETF_ByName[_fundName]].GHO_tokenManager.ghoTotalAmount;
    }

    /**
     * @dev Return fund's GHO address.
     * @return fund's GHO address.
     */
    function getETFGHOAddress(string memory _fundName) public view returns (address) {
        return ETF_SET[ETF_ByName[_fundName]].GHO_tokenManager.companyGHOVaultAddress;
    }

    /**
     * @dev Return current price.
     * @return fund's current weighted price.
     */
    function getETFWeightedPrice(string memory _fundName) public returns (uint) {
        return oracleGetETFPrice(_fundName);
    }

    /**
     * @dev Return currency type.
     * @return fund's currency type.
     */
    function getETFCurrencyType(string memory _fundName) public view returns (string memory) {
        return ETF_SET[ETF_ByName[_fundName]].currencyType;
    }

    /**
     * @dev Return buy fee. (public for testing)
     * @return fund's buy fee.
     */
    function getBuyFee(string memory _fundName) public view returns (uint) {
        return ETF_SET[ETF_ByName[_fundName]].buyFee;
    }

    /**
     * @dev Return sell fee. (public for testing)
     * @return fund's sell fee.
     */
    function getSellFee(string memory _fundName) public view returns (uint) {
        return ETF_SET[ETF_ByName[_fundName]].sellFee;
    }

    /**
     * @dev Return buy-fees accumulated amount. (public for testing)
     * @return fund's buy-fees accumulated amount.
     */
    function getTotalBuyFeeAmount(string memory _fundName) public view returns (uint) {
        return ETF_SET[ETF_ByName[_fundName]].totalBuyFeeAmount;
    }

    /**
     * @dev Return sell-fees accumulated amount. (public for testing)
     * @return fund's sell-fees accumulated amount.
     */
    function getTotalSellFeeAmount(string memory _fundName) public view returns (uint) {
        return ETF_SET[ETF_ByName[_fundName]].totalSellFeeAmount;
    }
}
