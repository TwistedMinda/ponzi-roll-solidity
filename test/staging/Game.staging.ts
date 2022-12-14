import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployStaging, play, tryWinning } from "../utils";
import { Game } from "../../typechain-types";

describe("Game", function () {

	describe('Randomization', () => {
		
		it('Generate random dice roll', async () => {
			const { owner, game, randomizer, coordinator } = await deployStaging();

			try {
				await randomizer.rollDice({
					gasLimit: 40000000
				})
			} catch (err) {
				console.log(err)
			}
			expect(false).to.be.true
			/*
			const { result } = await tryWinning(1, owner, game, randomizer, coordinator)
			console.log(result)
			expect(result).lessThanOrEqual(6)
			expect(result).above(0)*/
		})

	})
	
})
