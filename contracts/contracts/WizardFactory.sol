// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {MyToken} from "./MyToken.sol";
import {TokenVesting} from "./TokenVesting.sol";

contract WizardFactory {
    event WizardDeployed(
        address indexed founder,
        address tokenAddress,
        address[] vestingAddresses,
        string tokenName,
        string tokenSymbol,
        uint256 totalSupply,
        uint64 startTimestamp,
        uint64 cliffSeconds,
        uint64 durationSeconds
    );

    function deployWizard(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address[] memory beneficiaries,
        uint256[] memory weights,
        uint64 cliffSeconds,
        uint64 durationSeconds
    ) external returns (address token, address[] memory vestings) {
        require(beneficiaries.length == weights.length, "Mismatched arrays");
        require(beneficiaries.length > 0, "No beneficiaries");

        uint64 startTimestamp = uint64(block.timestamp);

        // The factory deploys the token and becomes the owner temporarily
        MyToken tokenContract = new MyToken(
            name,
            symbol,
            0, 
            address(this),
            address(this)
        );

        vestings = new address[](beneficiaries.length);
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            TokenVesting v = new TokenVesting(
                beneficiaries[i],
                startTimestamp,
                cliffSeconds,
                durationSeconds
            );
            vestings[i] = address(v);
            
            uint256 amount = (totalSupply * weights[i]) / totalWeight;
            tokenContract.mint(address(v), amount);
        }

        // Transfer ownership of the token to the founder (msg.sender)
        tokenContract.transferOwnership(msg.sender);

        emit WizardDeployed(
            msg.sender,
            address(tokenContract),
            vestings,
            name,
            symbol,
            totalSupply,
            startTimestamp,
            cliffSeconds,
            durationSeconds
        );

        return (address(tokenContract), vestings);
    }
}
