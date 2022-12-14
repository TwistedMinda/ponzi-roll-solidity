import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployStaging, play, tryWinning } from "../utils";
import { Game } from "../../typechain-types";
import { assert } from "console";

describe("Game", function () {

	describe('Randomization', () => {
		
		it('Generate random dice roll', async () => {
			const { owner, game, randomizer, coordinator } = await deployStaging();

			await randomizer.connect(owner).rollDice({
				maxFeePerGas: 25000000,
				maxPriorityFeePerGas: 25000000,
			})
			
			/*
			const { result } = await tryWinning(1, owner, game, randomizer, coordinator)
			console.log(result)
			expect(result).lessThanOrEqual(6)
			expect(result).above(0)*/
		})

	})
	
})
