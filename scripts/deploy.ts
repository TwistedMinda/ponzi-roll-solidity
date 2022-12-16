import { ethers, run } from "hardhat";
import { sleep, verify } from "../test/utils";
import {
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
} from "../test/networks.config";

import VRF_COORDINATOR_ABI from "@chainlink/contracts/abi/v0.8/VRFCoordinatorV2.json";

async function main() {
  const config = networkConfig[4002];
  const [owner] = await ethers.getSigners();

  const ChainlinkRandomizer = await ethers.getContractFactory(
    "ChainlinkRandomizer"
  );
  const randomizer = await ChainlinkRandomizer.deploy(
    config.subscriptionId,
    config.vrfCoordinator,
    config.keyHash
  );
  await randomizer.deployed();
  console.log(`✅ Randomizer deployed`);

  const Game = await ethers.getContractFactory("Game");
  const game = await Game.deploy(randomizer.address);
  await game.deployed();
  console.log(`✅ Game deployed`);

  await game.deployTransaction.wait(VERIFICATION_BLOCK_CONFIRMATIONS);
  await verify(randomizer.address, [
    config.subscriptionId,
    config.vrfCoordinator,
    config.keyHash,
  ]);
  await verify(game.address, [randomizer.address]);

  // Add consumer
  const coordinator = new ethers.Contract(
    config.vrfCoordinator,
    VRF_COORDINATOR_ABI,
    owner
  );
  await coordinator.addConsumer(config.subscriptionId, randomizer.address);
  console.log(`✅ Added consumer`);
  console.log("🚀 Randomizer: ", randomizer.address);
  console.log("🚀 Game: ", game.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
