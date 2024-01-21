// DFGFstoken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// DFGF SToken.
// initial supply: 10 billion tokens.
// 1000000000 * 10^18
// 10000000000000000000000000000
contract DFGFstoken is ERC20 {
    constructor(uint256 initialSupply) ERC20("DFGFstoken", "DFGF") {
        _mint(msg.sender, initialSupply);
    }
}
