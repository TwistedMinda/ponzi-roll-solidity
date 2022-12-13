
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

address constant linkAddress = 0xb0897686c545045aFc77CF20eC7A532E3120E0F1;
address constant linkCoordinator = 0xAE975071Be8F8eE67addBC1A82488F1C24858067;

abstract contract ChainlinkRandomizer is VRFConsumerBaseV2, ConfirmedOwner {
    struct RollStatus {
        bool exists;
        bool fulfilled;
        uint dieResult;
        uint dieBet;
		address player;
    }
    mapping(uint256 => RollStatus) public rolls;

    VRFCoordinatorV2Interface coordinator;

	bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
	uint64 subId;

	constructor(uint64 id) VRFConsumerBaseV2(linkAddress) ConfirmedOwner(msg.sender) {
		coordinator = VRFCoordinatorV2Interface(linkCoordinator);
		subId = id;
	}

	function rollDice(address player, uint dieBet) internal {
        uint requestId = coordinator.requestRandomWords(
            keyHash,
            subId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        rolls[requestId] = RollStatus({
			player: player,
            dieResult: 0,
			dieBet: dieBet,
            exists: true,
            fulfilled: false
        });
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal virtual override {
        require(rolls[_requestId].exists, "Roll not found");
        rolls[_requestId].fulfilled = true;
        rolls[_requestId].dieResult = _randomWords[0];
    }
}