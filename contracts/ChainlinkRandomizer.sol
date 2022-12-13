
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract Receiver {
	function rolledDice(uint _resultId, uint _dieResult) public {}
}

contract ChainlinkRandomizer is VRFConsumerBaseV2, ConfirmedOwner {
    event RollFinished(uint requestId);

    VRFCoordinatorV2Interface coordinator;

    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
	uint64 subId;
	bytes32 keyHash;
	address admin;
	Receiver game;

	constructor(
		uint64 id,
		address addr,
		bytes32 key
		) VRFConsumerBaseV2(addr) ConfirmedOwner(msg.sender) {
		coordinator = VRFCoordinatorV2Interface(addr);
		subId = id;
		keyHash = key;
		admin = msg.sender;
	}

	function rollDice() isGame() public returns (uint) {
		uint requestId = coordinator.requestRandomWords(
            keyHash,
            subId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
		return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory _randomWords
    ) internal override {
		emit RollFinished(requestId);
		game.rolledDice(requestId, (_randomWords[0] % 6) + 1);
    }
	
	function setGame(address _game) isOwner() public {
		game = Receiver(_game);
	}

	modifier isGame() {
		require(msg.sender == address(game), "Unknown caller");
		_;    
	}

	modifier isOwner() {
		require(msg.sender == admin, "Must use be owner");
		_;    
	}

}