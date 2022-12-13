import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { claim, deploy, GAME_PRICE, getInfo, getPlayer, play, playForLoss, playForWin, ROUND_DURATION, sleep } from "./utils";
import { Game } from "../typechain-types";

describe("Game", function () {

	it("test", async () => {
		const { owner, game,randomizer, VRFCoordinatorV2Mock } = await loadFixture(deploy);
		let rollId: BigNumber = BigNumber.from("0")
		const captureRollId = (value: any) => {
			rollId = value
			console.log('yo')
			return true
		}
		const captureBet = (value: any) => {
			console.log('bet', value)
			return true
		}
		const captureRes = (value: any) => {
			console.log('Res', value)
			return true
		}

		const captureWin = (value: any) => {
			console.log('win', value)
			return true
		}
		await expect(play(6, game, owner)).to.emit(game, 'RollStarted').withArgs(captureRollId)
		await expect(VRFCoordinatorV2Mock.fulfillRandomWords(rollId, randomizer.address))
			.to.emit(game, 'GameEnded').withArgs(owner.address, captureWin, captureBet, captureRes)
		
	})
	/*
	describe('Workflow', () => {
		
		it("Should upgrade round", async () => {
			const { owner, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);
	
			let timeSnap: BigNumber
	
			getInfo(game, ({ current, last }) => {
				expect(current.id).equal(1)
				timeSnap = last.timestamp
			})
	
			await time.increase(ROUND_DURATION)
			await playForLoss(owner, game, VRFCoordinatorV2Mock)
	
			getInfo(game, ({ current, last }) => {
				expect(current.id).equal(2)
				expect(last.timestamp).equal(timeSnap.add(ROUND_DURATION))
			})
		})
	
		it("Winning updates correctly", async () => {
			const { owner, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);
			
			getInfo(game, ({ current }) => expect(current.benefits).equal(0))
			await playForWin(owner, game, VRFCoordinatorV2Mock)
			getInfo(game, ({ stats, current }) => {
				expect(stats.totalWinners).equal(1)
				expect(current.benefits).equal(0)
			})
		})
	
		it("Losing updates correctly", async () => {
			const { owner, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);
	
			getInfo(game, ({ current }) => expect(current.benefits).equal(0))
			await playForLoss(owner, game, VRFCoordinatorV2Mock)
			getInfo(game, ({ current }) => expect(current.benefits).equal(GAME_PRICE))
		})
	
		it("Can claim", async () => {
			const { owner, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);
	
			getInfo(game, ({ stats }) => expect(stats.totalClaimed).equal(0))
	
			await playForWin(owner, game, VRFCoordinatorV2Mock)
			await playForLoss(owner, game, VRFCoordinatorV2Mock)
			await time.increase(ROUND_DURATION)
			await playForLoss(owner, game, VRFCoordinatorV2Mock)
			await expect(claim(game, owner)).to.not.be.reverted
		
			getInfo(game, ({ stats }) => expect(stats.totalClaimed).equal(GAME_PRICE))
		})
	})

	describe('Player', () => {

		it("Stats increasing", async () => {
			const { otherAccount, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);
			const target = otherAccount

			await getPlayer(target.address, game, (player) => {
				expect(player.nbShares).equal(0)
				expect(player.totalClaimed).equal(0)
			})

			await playForWin(target, game, VRFCoordinatorV2Mock)
			await playForLoss(target, game, VRFCoordinatorV2Mock)
			await time.increase(ROUND_DURATION)
			await playForLoss(target, game, VRFCoordinatorV2Mock)
			await claim(game, target)
		
			await getPlayer(target.address, game, (player) => {
				expect(player.nbShares).equal(1)
				expect(player.totalClaimed).equal(GAME_PRICE)
			})
		})
	})

	describe('Errors', () => {

		it("Nothing to claim", async () => {
			const { owner, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);
			await playForWin(owner, game, VRFCoordinatorV2Mock)
			await expect(claim(game, owner)).to.be.revertedWith('Nothing to claim')
		})
	
		it("No shares", async () => {
			const { owner, game } = await loadFixture(deploy);
			await expect(claim(game, owner)).to.be.revertedWith('You have no share')
		})
	
		it("Already claimed", async () => {
			const { owner, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);
			await playForWin(owner, game, VRFCoordinatorV2Mock)
			await playForLoss(owner, game, VRFCoordinatorV2Mock)
			await time.increase(ROUND_DURATION)
			await playForLoss(owner, game, VRFCoordinatorV2Mock)
			await claim(game, owner)
			await expect(claim(game, owner)).to.be.revertedWith('You already claimed for this round')
		})
		
		it("Entry price respected", async () => {
			const { owner, game, VRFCoordinatorV2Mock } = await loadFixture(deploy);
			await expect(play(2, game, owner, parseEther('1'))).to.be.revertedWith('Game price is not negociable')
			await expect(play(2, game, owner, parseEther('0.01'))).to.be.revertedWith('Game price is not negociable')
			await expect(play(2, game, owner, parseEther('0'))).to.be.revertedWith('Game price is not negociable')
		})
	})
	*/
	
})
