import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployStaging, play, tryWinning } from "../utils";
import { Game } from "../../typechain-types";
import { assert } from "console";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";

describe("Game", function () {

	describe('Randomization', () => {
		let rollId: BigNumber = BigNumber.from("0")
		const captureRollId = (value: any) => {
			rollId = value
			return true
		}
		
		/*
		it('Prevent direct calls to "rollDice()"', async () => {
			const { owner, game } = await deployStaging();

			await expect(play(1, game, owner)).to.emit(game, 'RollStarted').withArgs(captureRollId)
			console.log('Roll', rollId)

			await expect(game.diceRolled(rollId, 2)).to.be.reverted
		})
		*/

		it('Generate random dice roll', async () => {
			const { owner, game, randomizer, coordinator } = await deployStaging();
			
			await new Promise(async (resolve, reject) => {
				game.once("GameEnded", async (a, b, c, d) => {
					console.log('Res:', d)
					resolve(true)
				})
				await expect(play(1, game, owner)).to.emit(game, 'RollStarted').withArgs(captureRollId)
				console.log('Roll', rollId)
			})
		})
	})
	
})
