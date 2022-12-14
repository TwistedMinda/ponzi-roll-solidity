import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployStaging, play, tryWinning } from "../utils";
import { Game } from "../../typechain-types";

describe("Game", function () {

	describe('Randomization', () => {
		
		it('Generate random dice roll', async () => {
			const { owner, game, randomizer, coordinator } = await deployStaging();

			await randomizer.connect(owner).rollDice({ 
				maxFeePerGas: 2500000000000,
				maxPriorityFeePerGas: 2500000000000,
			 })
			//await play(1, game, owner)
			/*
			const { result } = await tryWinning(1, owner, game, randomizer, coordinator)
			console.log(result)
			expect(result).lessThanOrEqual(6)
			expect(result).above(0)*/
		})

	})
	
})
