
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

abstract contract ChainlinkRandomizer is VRFConsumerBaseV2, ConfirmedOwner {
    event RollStarted(uint requestId);
    event RollFinished(uint requestId);

	struct RollStatus {
        bool exists;
        bool fulfilled;
        uint dieResult;
        uint dieBet;
		address player;
    }
    mapping(uint256 => RollStatus) public rolls;

    VRFCoordinatorV2Interface coordinator;

    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
	uint64 subId;
	bytes32 keyHash;

	constructor(
		uint64 id,
		address addr,
		bytes32 key
		) VRFConsumerBaseV2(addr) ConfirmedOwner(msg.sender) {
		coordinator = VRFCoordinatorV2Interface(addr);
		subId = id;
		keyHash = key;
	}

	function rollDice(uint dieBet) internal {
		uint requestId = coordinator.requestRandomWords(
            keyHash,
            subId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        rolls[requestId] = RollStatus({
			player: msg.sender,
            dieResult: 0,
			dieBet: dieBet,
            exists: true,
            fulfilled: false
        });
		emit RollStarted(requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory _randomWords
    ) internal virtual override {
        require(rolls[requestId].exists, "Roll not found");
        rolls[requestId].fulfilled = true;
        rolls[requestId].dieResult = (_randomWords[0] % 6) + 1;
		emit RollFinished(requestId);
    }
	
}