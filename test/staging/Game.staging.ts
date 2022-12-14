import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployStaging, play, tryWinning } from "../utils";
import { Game } from "../../typechain-types";
import { assert } from "console";
import { BigNumber } from "ethers";

describe("Game", function () {

	describe('Randomization', () => {
		
		it('Generate random dice roll', async () => {
			const { owner, game, randomizer, coordinator } = await deployStaging();

			let rollId: BigNumber = BigNumber.from("0")
			const captureRollId = (value: any) => {
				rollId = value
				return true
			}
			await expect(play(1, game, owner)).to.emit(game, 'RollStarted').withArgs(captureRollId)
			console.log('Result', rollId)
			
			/*
			const { result } = await tryWinning(1, owner, game, randomizer, coordinator)
			expect(result).lessThanOrEqual(6)
			expect(result).above(0)
			*/
		})

		/*
		it('Prevent direct calls to "rollDice()"', async () => {
			const { randomizer } = await deployStaging();
			await expect(randomizer.rollDice()).to.be.reverted
		})
		*/
	})
	
})
