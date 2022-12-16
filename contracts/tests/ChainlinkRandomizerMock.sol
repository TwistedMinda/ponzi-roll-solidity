
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "../ChainlinkRandomizer.sol";

contract ChainlinkRandomizerMock is ChainlinkRandomizer  {
	
	constructor(
		uint64 id,
		address addr,
		bytes32 key
		) ChainlinkRandomizer(id, addr, key) {
	}
	
	function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory /*_randomWords*/
    ) virtual internal override {
		Receiver receiver = Receiver(receivers[requestId]);
		receiver.diceRolled(requestId, 2);
    }

}