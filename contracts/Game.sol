// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Game {
	string hello = "hello";

	function hellowWorld() public view returns (string memory) {
		return hello;
	}
}