/ SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title BuyDefiFund
 * @dev Invest in DeFiFund; Swap GHO tokens for DefiFund tokens.
 */
contract StokenETFManager {

    uint sequenceNumber;

    struct GHO_TokenVault {
        uint ghoTotalAmount; // should be kept in sync with amount on the blockchain.
        address companyGHOAddress; // the company's vault on the GHO token.
    }

    struct ETF_Fund {
        bytes32 fundId;   // short name (up to 32 bytes)
        uint maxAllocation; // current allocation size; fund amount is expandable via minting.
        uint currentSupply; // current amount available without need for minting; initially same as maxAllocation.
        uint currentPrice; // fund's current price; retrieved from an Oracle.
        uint buyFee; // amount charged on buying.
        uint sellFee; // amount charged on selling.
        uint totalBuyFeeAmount; // accumulated total in buy fees.
        uint totalSellFeeAmount; // accumulated total in sell fees.
        //
        mapping(address => uint) investorsMap; // track fund investors and amount
    }

    GHO_TokenVault GHO_tokenManager;
    mapping(uint => ETF_Fund) public ETF_SET;
    mapping(string => uint) public ETF_ByName;

    constructor(address GHO_token) {
        sequenceNumber = 10000; // start at a bigger than zero number; first fund starts at 10001.
        GHO_tokenManager.ghoTotalAmount = 0; // can be assumed to be 0.
        GHO_tokenManager.companyGHOAddress = GHO_token; // this should be a valid GHO token address. 
    }

    /**
     * @dev Create an ETF and return its fund id.
     * @return value of the ETF'S fund id.
     */
    function createETF(bytes32 _fundName, uint _maxAllocation, uint buyFee, uint sellFee) public returns (uint) {
        ++sequenceNumber;
        ETF_ByName[_fundName] = sequenceNumber; // map name to fund's id.
        ETF_SET[sequenceNumber] = ETF_Fund(_fundName, _maxAllocation, _maxAllocation, 0, 0, 0, 0, 0); // create fund.
        return(sequenceNumber); // the fund's id.
    }

    /**
     * @dev Return ETF's real-time price.
     * @return value of the ETF'S current price.
     */
    function oracleGetETFsPrice(bytes32 _fundName) public view returns (uint){
        // Hardcoded for now: 5 underlying tokens with an equal weighting of 20%. 
        uint weightedPrice = (101.13 + 56.44 + 0.46 + 6.71 + 3.57) * .20; // normally call ETFOracle_GetPrice(_fundName);
        return ETF_SET[ETF_ByName[_fundName]].currentPrice = weightedPrice;
    }

    /**
     * @dev Buy _investAmount of some ETF.
     * @return number of tokens or token units bought.
     */
    function buyETFToken(bytes32 _fundName, uint _investGHOTokenAmount, address transferGHOAddress) public returns (uint) {

        // REVISIT: ***********
        // REVISIT: *********** transfer the user's GHO tokens to the company's vault.
        // REVISIT: ***********

        // on success of transfer.
        uint buyFee = ETF_SET[ETF_ByName[_fundName]].buyFee;
        uint currentGHOtoUSDPrice = getGHO_USDPrice();

        uint _realUSD_BuyAmount = (_investGHOTokenAmount * currentGHOtoUSDPrice) - buyFee; // Fees in USD.
        uint _ETFTokenAmount = _realUSD_BuyAmount / getETFUSDPrice(_fundName);

        require (ETF_SET[ETF_ByName[_fundName]].currentSupply >= _ETFTokenAmount, "Failure; Fund fully allocated."); 

        ETF_SET[ETF_ByName[_fundName]].currentSupply -= _ETFTokenAmount;
        ETF_SET[ETF_ByName[_fundName]].totalBuyFeeAmount += buyFee;
        ETF_SET[ETF_ByName[_fundName]].investorsMap[msg.sender] = _ETFTokenAmount;

        return _ETFTokenAmount;
    }

    /**
     * @dev Return pool id.
     * @return value of pool id.
     */
    function sellETFToken(bytes32 _fundName, uint _sellETFAmount, address sendtoGHOAddress) public returns (uint){
        require(ETF_SET[ETF_ByName[_fundName]].investorsMap[msg.sender], "Failure: You donot have an account");

        uint sellersRealTokenAmount = ETF_SET[ETF_ByName[_fundName]].investorsMap[msg.sender];

        require(sellersRealTokenAmount >= _sellETFAmount, "Failure; insufficient tokens"); 

        ETF_SET[ETF_ByName[_fundName]].investorsMap[msg.sender] -= _sellETFAmount;
        ETF_SET[ETF_ByName[_fundName]].currentSupply += _sellETFAmount;

        uint _sellersUSDValue = _sellETFAmount * getETFUSDPrice(_fundName); // number_of_tokens * ETF's USD price.

        uint sellFee = ETF_SET[ETF_ByName[_fundName]].sellFee;
        uint _realSellersUSDValue = _sellersUSDValue - sellFee; // sell feee is in USD.
        ETF_SET[ETF_ByName[_fundName]].totalSellFeeAmount += sellFee;

        // convert to GHO
        uint _ghoTokenAmount = _realSellersUSDValue / getGHOperUSDPrice();

        GHO_tokenManager.ghoTotalAmount -= -ghoTokenAmount;

        // REVISIT: ***********
        // REVISIT: *********** transfer GHO tokens from the company's vault to his address.
        // REVISIT: ***********

        return _ghoTokenAmount;
    }

    /**
     * @dev Return current price.
     * @return value fund's buy fee.
     */
    function getETFUSDPrice(bytes32 _fundName) public view returns (uint) {
        return oracleGetETF_USDPrice(_fundName);
    }

    /**
     * @dev Return buy fee. (public for testing)
     * @return value fund's buy fee.
     */
    function getBuyFee(bytes32 _fundName) public view returns (uint) {
        return ETF_SET[ETF_ByName[_fundName]].buyFee;
    }

    /**
     * @dev Return sell fee. (public for testing)
     * @return value fund's buy fee.
     */
    function getSellFee(bytes32 _fundName) public view returns (uint) {
        return ETF_SET[ETF_ByName[_fundName]].sellFee;
    }

    /**
     * @dev Return buy-fees accumulated amount. (public for testing)
     * @return value fund's buy-fees accumulated amount.
     */
    function getTotalBuyFeeAmount(bytes32 _fundName) public view returns (uint) {
        return ETF_SET[ETF_ByName[_fundName]].totalBuyFeeAmount;
    }

    /**
     * @dev Return sell-fees accumulated amount. (public for testing)
     * @return value fund's sell-fees accumulated amount.
     */
    function getTotalSellFeeAmount(bytes32 _fundName) public view returns (uint) {
        return ETF_SET[ETF_ByName[_fundName]].totalSellFeeAmount;
    }
}
