// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SoulboundToken.sol";

contract DeploySoulboundToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        SoulboundToken sbt = new SoulboundToken(deployerAddress);

        vm.stopBroadcast();

        console.log("SoulboundToken deployed at:", address(sbt));
    }
}
