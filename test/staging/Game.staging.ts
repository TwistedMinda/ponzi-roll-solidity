import { expect } from "chai";
import { deployStaging, play, tryWinning } from "../utils";
import { assert } from "console";
import { BigNumber } from "ethers";

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
				game.once("GameEnded", async (_addr, _isWin, _dieBet, dieResult: BigNumber) => {
					console.log('> Rolled dice:', dieResult)
					try {
						assert(dieResult.gte(0), "Result >= 0")
						assert(dieResult.lte(6), "Result <= 6")
						resolve(true)
					} catch (e) {
						reject(e)
					}
				})
				await expect(play(1, game, owner)).to.emit(game, 'RollStarted').withArgs(captureRollId)
				console.log('> Roll id: ', rollId)
			})
		})
	})
	
})
