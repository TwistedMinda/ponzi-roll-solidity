import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";
import { Game } from "../typechain-types";
import { BigNumber } from "ethers";

type CurrentRound = Awaited<ReturnType<Game['currentRound']>>
type LastRound = Awaited<ReturnType<Game['lastRound']>>
type Stats = Awaited<ReturnType<Game['stats']>>

type Info = {
	current: CurrentRound,
	last: LastRound,
	stats: Stats,
}
type GetInfoCallback = (info: Info) => void

const ROUND_DURATION = 5 * 60
const GAME_PRICE = parseEther("0.001")

const refetchInfo = async (game: Game, callback: GetInfoCallback) => {
	callback({
		current: await game.currentRound(),
		last: await game.lastRound(),
		stats: await game.stats(),
	})
}

const _play = (bet: number, game: Game, from: string) => game.play(bet, {
	from,
	value: parseEther("0.001"),
});

const deploy = async () => {
	const [owner, otherAccount] = await ethers.getSigners();

	const Game = await ethers.getContractFactory("Game");
	const game = await Game.deploy();

	return { game, owner, otherAccount };
}

describe("Game", function () {
	
	it("Should upgrade round", async function () {
		const { owner, game } = await loadFixture(deploy);

		let before: BigNumber = 0
		refetchInfo(game, ({ current, last }) => {
			expect(current.id).equal(1)
			before = last.timestamp
		})

		await time.increase(ROUND_DURATION)
		await _play(1, game, owner.address)

		refetchInfo(game, ({ current, last }) => {
			expect(current.id).equal(2)
			expect(last.timestamp).equal(before.add(ROUND_DURATION))
		})
	})

	it("Winning updates correctly", async function () {
		const { owner, game } = await loadFixture(deploy);
		
		refetchInfo(game, ({ current }) => expect(current.benefits).equal(0))
		await _play(2, game, owner.address)
		refetchInfo(game, ({ stats, current }) => {
			expect(stats.totalWinners).equal(1)
			expect(current.benefits).equal(0)
		})
	})

	it("Losing updates correctly", async function () {
		const { owner, game } = await loadFixture(deploy);

		refetchInfo(game, ({ current }) => expect(current.benefits).equal(0))
		await _play(1, game, owner.address)
		refetchInfo(game, ({ current }) => expect(current.benefits).equal(GAME_PRICE))
	})
	
})
