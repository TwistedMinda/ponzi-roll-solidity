
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract Receiver {
	function diceRolled(uint _resultId, uint _dieResult) public {}
}

contract ChainlinkRandomizer is VRFConsumerBaseV2, ConfirmedOwner {
    VRFCoordinatorV2Interface coordinator;
    uint32 callbackGasLimit = 2500000;
    uint16 requestConfirmations = 1;
    uint32 numWords = 1;
	uint64 subId;
	bytes32 keyHash;

	mapping (uint => address) receivers;

	constructor(
		uint64 id,
		address addr,
		bytes32 key
		) VRFConsumerBaseV2(addr) ConfirmedOwner(msg.sender) {
		coordinator = VRFCoordinatorV2Interface(addr);
		subId = id;
		keyHash = key;
	}

	function rollDice(address game) public returns (uint) {
		uint requestId = coordinator.requestRandomWords(
            keyHash,
            subId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
		receivers[requestId] = game;
		return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory _randomWords
    ) virtual internal override {
		Receiver receiver = Receiver(receivers[requestId]);
		receiver.diceRolled(requestId, (_randomWords[0] % 6) + 1);
    }

}