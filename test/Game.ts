import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { checkWin, claim, deploy, GAME_PRICE, getInfo, getPlayer, play, ROUND_DURATION } from "./utils";
import { Game } from "../typechain-types";

describe("Game", function () {

	it("Lose", async function () {
		const { owner, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);
		
		await play(5, game, owner)

		const win = await checkWin(game, VRFCoordinatorV2Mock)
		expect(win).to.be.false
	})

	it("Win", async function () {
		const { owner, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);

		await play(5, game, owner)
		const win = await checkWin(game, VRFCoordinatorV2Mock)
		expect(win).to.be.true
	})

	return;

	describe('Workflow', () => {
		
		it("Should upgrade round", async () => {
			const { owner, game } = await loadFixture(deploy);
	
			let timeSnap: BigNumber
	
			getInfo(game, ({ current, last }) => {
				expect(current.id).equal(1)
				timeSnap = last.timestamp
			})
	
			await time.increase(ROUND_DURATION)
			await play(1, game, owner)
	
			getInfo(game, ({ current, last }) => {
				expect(current.id).equal(2)
				expect(last.timestamp).equal(timeSnap.add(ROUND_DURATION))
			})
		})
	
		it("Winning updates correctly", async () => {
			const { owner, game } = await loadFixture(deploy);
			
			getInfo(game, ({ current }) => expect(current.benefits).equal(0))
			await play(2, game, owner)
			getInfo(game, ({ stats, current }) => {
				expect(stats.totalWinners).equal(1)
				expect(current.benefits).equal(0)
			})
		})
	
		it("Losing updates correctly", async () => {
			const { owner, game } = await loadFixture(deploy);
	
			getInfo(game, ({ current }) => expect(current.benefits).equal(0))
			await play(1, game, owner)
			getInfo(game, ({ current }) => expect(current.benefits).equal(GAME_PRICE))
		})
	
		it("Can claim", async () => {
			const { owner, game } = await loadFixture(deploy);
	
			getInfo(game, ({ stats }) => expect(stats.totalClaimed).equal(0))
	
			await play(2, game, owner)
			await play(1, game, owner)
			await time.increase(ROUND_DURATION)
			await play(1, game, owner)
			await expect(claim(game, owner)).to.not.be.reverted
		
			getInfo(game, ({ stats }) => expect(stats.totalClaimed).equal(GAME_PRICE))
		})
	})

	describe('Player', () => {

		it("Stats increasing", async () => {
			const { owner, otherAccount, game } = await loadFixture(deploy);
			const target = otherAccount

			await getPlayer(target.address, game, (player) => {
				expect(player.nbShares).equal(0)
				expect(player.totalClaimed).equal(0)
			})

			await play(2, game, target)
			await play(1, game, target)
			await time.increase(ROUND_DURATION)
			await play(1, game, target)
			await claim(game, target)
		
			await getPlayer(target.address, game, (player) => {
				expect(player.nbShares).equal(1)
				expect(player.totalClaimed).equal(GAME_PRICE)
			})
		})
	})

	describe('Errors', () => {

		it("Nothing to claim", async () => {
			const { owner, game } = await loadFixture(deploy);
			await play(2, game, owner)
			await expect(claim(game, owner)).to.be.revertedWith('Nothing to claim')
		})
	
		it("No shares", async () => {
			const { owner, game } = await loadFixture(deploy);
			await expect(claim(game, owner)).to.be.revertedWith('You have no share')
		})
	
		it("Already claimed", async () => {
			const { owner, game } = await loadFixture(deploy);
			await play(2, game, owner)
			await play(1, game, owner)
			await time.increase(ROUND_DURATION)
			await play(1, game, owner)
			await claim(game, owner)
			await expect(claim(game, owner)).to.be.revertedWith('You already claimed for this round')
		})
		
		it("Entry price respected", async () => {
			const { owner, game } = await loadFixture(deploy);
			await expect(play(2, game, owner, parseEther('1'))).to.be.revertedWith('Game price is not negociable')
			await expect(play(2, game, owner, parseEther('0.01'))).to.be.revertedWith('Game price is not negociable')
			await expect(play(2, game, owner, parseEther('0'))).to.be.revertedWith('Game price is not negociable')
		})
	})

	
})
