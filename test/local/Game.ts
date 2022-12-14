import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { claim, deploy, GAME_PRICE, getInfo, getPlayer, play, playForLoss, playForWin, ROUND_DURATION, sleep, tryWinning } from "../utils";
import { Game } from "../../typechain-types";

const readEvents = async (res: any) => {
	const trx = await res.wait(1)
	for (const r of trx.events)
		console.log(r.event, r.args)
}

describe("Game", function () {

	describe('Randomization', () => {
		
		it('Generate random dice roll', async () => {
			const { owner, game, randomizer, coordinator } = await deploy({ realRandomizer: true });
			const { result } = await tryWinning(1, owner, game, randomizer, coordinator)
			expect(result).lessThanOrEqual(6)
			expect(result).above(0)
		})

	})

	describe('Workflow', () => {
		
		it("Should upgrade round", async () => {
			const { owner, game, randomizer, coordinator } = await loadFixture(deploy);
	
			let timeSnap: BigNumber
	
			getInfo(game, ({ current, last }) => {
				expect(current.id).equal(1)
				timeSnap = last.timestamp
			})
	
			await time.increase(ROUND_DURATION)
			await playForLoss(owner, game, randomizer, coordinator)
	
			getInfo(game, ({ current, last }) => {
				expect(current.id).equal(2)
				expect(last.timestamp).equal(timeSnap.add(ROUND_DURATION))
			})
		})
	
		it("Winning updates correctly", async () => {
			const { owner, game, randomizer, coordinator } = await loadFixture(deploy);
			
			getInfo(game, ({ current }) => expect(current.benefits).equal(0))
			await playForWin(owner, game, randomizer, coordinator)
			getInfo(game, ({ stats, current }) => {
				expect(stats.totalWinners).equal(1)
				expect(current.benefits).equal(0)
			})
		})
	
		it("Losing updates correctly", async () => {
			const { owner, game, randomizer, coordinator } = await loadFixture(deploy);
	
			getInfo(game, ({ current }) => expect(current.benefits).equal(0))
			await playForLoss(owner, game, randomizer, coordinator)
			getInfo(game, ({ current }) => expect(current.benefits).equal(GAME_PRICE))
		})
	
		it("Can claim", async () => {
			const { owner, game, randomizer, coordinator } = await loadFixture(deploy);
	
			getInfo(game, ({ stats }) => expect(stats.totalClaimed).equal(0))
	
			await playForWin(owner, game, randomizer, coordinator)
			await playForLoss(owner, game, randomizer, coordinator)
			await time.increase(ROUND_DURATION)
			await playForLoss(owner, game, randomizer, coordinator)
			await expect(claim(game, owner)).to.not.be.reverted
		
			getInfo(game, ({ stats }) => expect(stats.totalClaimed).equal(GAME_PRICE))
		})
	})

	describe('Player', () => {

		it("Stats increasing", async () => {
			const { otherAccount, game, randomizer, coordinator } = await loadFixture(deploy);
			const target = otherAccount

			await getPlayer(target.address, game, (player) => {
				expect(player.nbShares).equal(0)
				expect(player.totalClaimed).equal(0)
			})

			await playForWin(target, game, randomizer, coordinator)
			await playForLoss(target, game, randomizer, coordinator)
			await time.increase(ROUND_DURATION)
			await playForLoss(target, game, randomizer, coordinator)
			await claim(game, target)
		
			await getPlayer(target.address, game, (player) => {
				expect(player.nbShares).equal(1)
				expect(player.totalClaimed).equal(GAME_PRICE)
			})
		})
	})

	describe('Errors', () => {

		it("Nothing to claim", async () => {
			const { owner, game, randomizer, coordinator } = await loadFixture(deploy);
			await playForWin(owner, game, randomizer, coordinator)
			await expect(claim(game, owner)).to.be.revertedWith('Nothing to claim')
		})
	
		it("No shares", async () => {
			const { owner, game } = await loadFixture(deploy);
			await expect(claim(game, owner)).to.be.revertedWith('You have no share')
		})
	
		it("Already claimed", async () => {
			const { owner, game, randomizer, coordinator } = await loadFixture(deploy);
			await playForWin(owner, game, randomizer, coordinator)
			await playForLoss(owner, game, randomizer, coordinator)
			await time.increase(ROUND_DURATION)
			await playForLoss(owner, game, randomizer, coordinator)
			await claim(game, owner)
			await expect(claim(game, owner)).to.be.revertedWith('You already claimed for this round')
		})
		
		it("Entry price respected", async () => {
			const { owner, game, randomizer, coordinator } = await loadFixture(deploy);
			await expect(play(2, game, owner, parseEther('1'))).to.be.revertedWith('Game price is not negociable')
			await expect(play(2, game, owner, parseEther('0.01'))).to.be.revertedWith('Game price is not negociable')
			await expect(play(2, game, owner, parseEther('0'))).to.be.revertedWith('Game price is not negociable')
		})
	})
	
})
