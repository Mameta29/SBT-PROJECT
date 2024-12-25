// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SoulboundToken.sol";

contract SoulboundTokenTest is Test {
    SoulboundToken public sbt;
    address public owner;

    function setUp() public {
        owner = address(this);
        sbt = new SoulboundToken(owner);
    }

    function testMint() public {
        address recipient = address(1);
        string memory uri = "https://example.com/token/0";

        sbt.safeMint(recipient, uri);

        assertEq(sbt.ownerOf(0), recipient);
        assertEq(sbt.tokenURI(0), uri);
    }

    function testTransferFails() public {
        address recipient = address(1);
        sbt.safeMint(recipient, "");

        vm.prank(recipient);
        vm.expectRevert("SBT: transfer is not allowed");
        sbt.transferFrom(recipient, address(2), 0);
    }

    function testOnlyOwnerCanMint() public {
        address nonOwner = address(1);

        vm.prank(nonOwner);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                nonOwner
            )
        );
        sbt.safeMint(nonOwner, "");
    }
}
