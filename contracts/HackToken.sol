// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the official OpenZeppelin ERC-20 implementation
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HackToken is ERC20 {
    
    /**
     * @dev Constructor that mints the initial supply to the founder.
     * @param name The name of the token (e.g., "Decrypto Coin")
     * @param symbol The symbol of the token (e.g., "DCR")
     * @param initialSupply The total amount of tokens to mint initially
     * @param founder The wallet address receiving the tokens
     */
    constructor(
        string memory name, 
        string memory symbol, 
        uint256 initialSupply,
        address founder
    ) ERC20(name, symbol) {
        _mint(founder, initialSupply);
    }
}
