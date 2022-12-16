import { expect } from "chai";
import { deployStaging, play, tryWinning } from "../utils";
import { assert } from "console";
import { BigNumber } from "ethers";

describe("Game", function () {
  let rollId: BigNumber = BigNumber.from("0");
  const captureRollId = (value: any) => {
    rollId = value;
    return true;
  };

  describe("Security", async () => {
    it('Prevent direct calls to "diceRolled()"', async () => {
      const { owner, game } = await deployStaging();

      await expect(play(1, game, owner))
        .to.emit(game, "RollStarted")
        .withArgs(captureRollId);
      const res = await game.connect(owner).diceRolled(rollId, 2);
      let success = false;
      try {
        await res.wait(1);
        success = true;
      } catch (err: any) {
        expect(err.reason === "transaction_failed");
      }
      expect(success).to.be.false;
    });
  });

  describe("Randomization", () => {
    it("Generate random dice roll", async () => {
      const { owner, game, randomizer, coordinator } = await deployStaging();

      await new Promise((resolve, reject) => {
        game.once(
          "GameEnded",
          async (_addr, _isWin, _dieBet, dieResult: BigNumber) => {
            try {
              assert(dieResult.gte(0), "Result >= 0");
              assert(dieResult.lte(6), "Result <= 6");
              resolve(true);
            } catch (e) {
              reject(e);
            }
          }
        );
        expect(play(1, game, owner))
          .to.emit(game, "RollStarted")
          .withArgs(captureRollId);
      });
    });
  });
});
