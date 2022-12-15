// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "./ChainlinkRandomizer.sol";

uint constant GAME_PRICE = 0.001 ether;
uint constant ROUND_DURATION = 5 minutes;

struct Stats {
    uint totalClaimed;
    uint totalWinners;
    uint totalRolls;
}

struct PlayerState {
    uint lastClaimedRound;
    uint totalClaimed;
    uint nbShares;
    uint currentRoundShares;
    uint lastWinRound;
}

struct CurrentRound {
    uint id;
    uint benefits;
}

struct LastRound {
    uint winners;
    uint benefits;
    uint timestamp;
    uint totalClaimed;
}

struct RollStatus {
	bool exists;
	bool fulfilled;
	uint dieResult;
	uint dieBet;
	address player;
}

contract Game {
    event RollStarted(uint requestId);
    event GameEnded(address bidder, bool win, uint bet, uint result);
    
    mapping(uint256 => RollStatus) public rolls;

    mapping (address => PlayerState) public players;
    CurrentRound public currentRound;
    LastRound public lastRound;
    Stats public stats;
	ChainlinkRandomizer randomizer;

    constructor(address randomizerAddress) {
        currentRound.id = 1;
        lastRound.timestamp = block.timestamp;
		randomizer = ChainlinkRandomizer(randomizerAddress);
    }

    function play(uint bet) public payable {
        require(msg.value == GAME_PRICE, "Game price is not negociable");
        if (getClaimableAmount(msg.sender) > 0)
            claim();
        increaseRoundIfNeeded();
        if (currentRound.id > players[msg.sender].lastWinRound)
            players[msg.sender].currentRoundShares = 0;
		uint requestId = randomizer.rollDice();
        rolls[requestId] = RollStatus({
			player: address(msg.sender),
            dieResult: 0,
			dieBet: bet,
            exists: true,
            fulfilled: false
        });
		emit RollStarted(requestId);
    }

	function diceRolled(
        uint requestId,
        uint dieResult
    ) public {
        require(rolls[requestId].exists, "Roll not found");

		uint bet = rolls[requestId].dieBet;
		address playerAddress = rolls[requestId].player;
        bool isWin = bet == dieResult;
        if (isWin) {
            // WIN
			++players[playerAddress].nbShares;
            ++players[playerAddress].currentRoundShares;
            players[playerAddress].lastWinRound = currentRound.id;

            ++stats.totalWinners;
            //transfer(payable(playerAddress), GAME_PRICE);
        } else {
            // LOSS
            currentRound.benefits += GAME_PRICE;
        }
        ++stats.totalRolls;
        emit GameEnded(playerAddress, isWin, bet, dieResult);
	}

    function claim() public {
        PlayerState storage state = players[msg.sender];
        require(state.nbShares > 0, "You have no share");
        require(state.lastClaimedRound < currentRound.id, "You already claimed for this round");

        uint claimable = getClaimableAmount(msg.sender);
        require(claimable > 0, "Nothing to claim");
        transfer(payable(msg.sender), claimable);

        stats.totalClaimed += claimable;
        lastRound.totalClaimed += claimable;
        state.totalClaimed += claimable;
        state.lastClaimedRound = currentRound.id;
    }

    function increaseRoundIfNeeded() private {
        if (block.timestamp - lastRound.timestamp < ROUND_DURATION)
            return;
        if (stats.totalWinners > 0) {
            uint lastRoundUnclaimed = lastRound.benefits - lastRound.totalClaimed;
            lastRound.benefits = currentRound.benefits + lastRoundUnclaimed;
            lastRound.winners = stats.totalWinners;
            lastRound.totalClaimed = 0;
            currentRound.benefits = 0;
        }
        lastRound.timestamp = block.timestamp;
        ++currentRound.id;
    }

    function getClaimableAmount(address player) public view returns (uint) {
        if (lastRound.winners == 0)
            return 0;
        PlayerState storage state = players[player];
        if (state.lastClaimedRound == currentRound.id)
            return 0;
        uint nbShares = state.nbShares;
        if (state.currentRoundShares > 0 && state.lastWinRound == currentRound.id)
            nbShares -= state.currentRoundShares;
        return (lastRound.benefits / lastRound.winners) * nbShares;
    }

    function transfer(address payable _to, uint _amount) private {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
	}

	modifier isRandomizer() {
		require(msg.sender == address(randomizer), "Unknown caller");
		_;    
	}
}