import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Game", function () {
	
	async function deploy() {
		const [owner, otherAccount] = await ethers.getSigners();

		const Game = await ethers.getContractFactory("Game");
		const game = await Game.deploy();

		return { game, owner, otherAccount };
	}

	it("Should be noo winners", async function () {
		const { game } = await loadFixture(deploy);
		const last = await game.lastRound()
		expect(last.winners).equal(0)
	})
	
})
