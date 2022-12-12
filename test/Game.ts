import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";
import { Game } from "../typechain-types";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

type CurrentRound = Awaited<ReturnType<Game['currentRound']>>
type LastRound = Awaited<ReturnType<Game['lastRound']>>
type Stats = Awaited<ReturnType<Game['stats']>>
type PlayerState = Awaited<ReturnType<Game['players']>>

type Info = {
	current: CurrentRound,
	last: LastRound,
	stats: Stats,
}
type GetInfoCallback = (info: Info) => Promise<any> | any
type GetPlayerCallback = (player: PlayerState) => Promise<any> | any

const ROUND_DURATION = 5 * 60
const GAME_PRICE = parseEther("0.001")

const _getInfo = async (game: Game, callback: GetInfoCallback) => callback({
	current: await game.currentRound(),
	last: await game.lastRound(),
	stats: await game.stats(),
})

const _getPlayer = async (address: string, game: Game, callback: GetPlayerCallback) => callback(await game.players(address))

const _play = (
	bet: number,
	game: Game,
	account: SignerWithAddress,
	amount = GAME_PRICE
) => game.connect(account).play(bet, {
	from: account.address,
	value: amount,
});
const _claim = (game: Game, account: SignerWithAddress) => game.connect(account).claim({
	from: account.address,
});

const deploy = async () => {
	const [owner, otherAccount] = await ethers.getSigners();

	const Game = await ethers.getContractFactory("Game");
	const game = await Game.deploy();

	return { game, owner, otherAccount };
}

describe("Game", function () {
	
	describe('Workflow', () => {
		
		it("Should upgrade round", async () => {
			const { owner, game } = await loadFixture(deploy);
	
			let timeSnap: BigNumber
	
			_getInfo(game, ({ current, last }) => {
				expect(current.id).equal(1)
				timeSnap = last.timestamp
			})
	
			await time.increase(ROUND_DURATION)
			await _play(1, game, owner)
	
			_getInfo(game, ({ current, last }) => {
				expect(current.id).equal(2)
				expect(last.timestamp).equal(timeSnap.add(ROUND_DURATION))
			})
		})
	
		it("Winning updates correctly", async () => {
			const { owner, game } = await loadFixture(deploy);
			
			_getInfo(game, ({ current }) => expect(current.benefits).equal(0))
			await _play(2, game, owner)
			_getInfo(game, ({ stats, current }) => {
				expect(stats.totalWinners).equal(1)
				expect(current.benefits).equal(0)
			})
		})
	
		it("Losing updates correctly", async () => {
			const { owner, game } = await loadFixture(deploy);
	
			_getInfo(game, ({ current }) => expect(current.benefits).equal(0))
			await _play(1, game, owner)
			_getInfo(game, ({ current }) => expect(current.benefits).equal(GAME_PRICE))
		})
	
		it("Can claim", async () => {
			const { owner, game } = await loadFixture(deploy);
	
			_getInfo(game, ({ stats }) => expect(stats.totalClaimed).equal(0))
	
			await _play(2, game, owner)
			await _play(1, game, owner)
			await time.increase(ROUND_DURATION)
			await _play(1, game, owner)
			await expect(_claim(game, owner)).to.not.be.reverted
		
			_getInfo(game, ({ stats }) => expect(stats.totalClaimed).equal(GAME_PRICE))
		})
	})

	describe('Player', () => {

		it("Stats increasing", async () => {
			const { owner, otherAccount, game } = await loadFixture(deploy);
			const target = otherAccount

			await _getPlayer(target.address, game, (player) => {
				expect(player.nbShares).equal(0)
				expect(player.totalClaimed).equal(0)
			})

			await _play(2, game, target)
			await _play(1, game, target)
			await time.increase(ROUND_DURATION)
			await _play(1, game, target)
			await _claim(game, target)
		
			await _getPlayer(target.address, game, (player) => {
				expect(player.nbShares).equal(1)
				expect(player.totalClaimed).equal(GAME_PRICE)
			})
		})
	})

	describe('Errors', () => {

		it("Nothing to claim", async () => {
			const { owner, game } = await loadFixture(deploy);
			await _play(2, game, owner)
			await expect(_claim(game, owner)).to.be.revertedWith('Nothing to claim')
		})
	
		it("No shares", async () => {
			const { owner, game } = await loadFixture(deploy);
			await expect(_claim(game, owner)).to.be.revertedWith('You have no share')
		})
	
		it("Already claimed", async () => {
			const { owner, game } = await loadFixture(deploy);
			await _play(2, game, owner)
			await _play(1, game, owner)
			await time.increase(ROUND_DURATION)
			await _play(1, game, owner)
			await _claim(game, owner)
			await expect(_claim(game, owner)).to.be.revertedWith('You already claimed for this round')
		})
		
		it("Entry price respected", async () => {
			const { owner, game } = await loadFixture(deploy);
			await expect(_play(2, game, owner, parseEther('1'))).to.be.revertedWith('Game price is not negociable')
			await expect(_play(2, game, owner, parseEther('0.01'))).to.be.revertedWith('Game price is not negociable')
			await expect(_play(2, game, owner, parseEther('0'))).to.be.revertedWith('Game price is not negociable')
		})
	})

	
})
