// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VestingWallet} from "@openzeppelin/contracts/finance/VestingWallet.sol";

contract TokenVesting is VestingWallet {
    uint64 private immutable _cliffDuration;

    constructor(
        address beneficiaryAddress,
        uint64 startTimestamp,
        uint64 cliffSeconds,
        uint64 durationSeconds
    ) VestingWallet(beneficiaryAddress, startTimestamp, durationSeconds) {
        _cliffDuration = cliffSeconds;
    }

    function cliff() public view virtual returns (uint256) {
        return start() + _cliffDuration;
    }

    function _vestingSchedule(uint256 totalAllocation, uint64 timestamp) internal view virtual override returns (uint256) {
        if (timestamp < cliff()) {
            return 0;
        }
        return super._vestingSchedule(totalAllocation, timestamp);
    }
}
