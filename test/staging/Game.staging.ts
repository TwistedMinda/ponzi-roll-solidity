import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployStaging, tryWinning } from "../utils";
import { Game } from "../../typechain-types";

describe("Game", function () {

	describe('Randomization', () => {
		
		it('Generate random dice roll', async () => {
			const { owner, game, randomizer, coordinator } = await loadFixture(deployStaging);
			const { result } = await tryWinning(1, owner, game, randomizer, coordinator)
			expect(result).lessThanOrEqual(6)
			expect(result).above(0)
		})

	})
	
})
