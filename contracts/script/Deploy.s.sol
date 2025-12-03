// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/tokens/PermitERC20.sol";
import "../src/visualizer/AllowanceLens.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        PermitERC20 token = new PermitERC20("MockToken", "MCK");
        // mint owner address some tokens
        token._mint(msg.sender, 1_000 ether);

        AllowanceLens lens = new AllowanceLens();

        console.log("TOKEN:", address(token));
        console.log("LENS:", address(lens));

        vm.stopBroadcast();
    }
}
