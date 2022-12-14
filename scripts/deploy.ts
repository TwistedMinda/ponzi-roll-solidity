import { ethers, run } from "hardhat";
import { sleep } from "../test/utils";
import {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
} from "../test/networks.config"

import VRF_COORDINATOR_ABI from "@chainlink/contracts/abi/v0.8/VRFCoordinatorV2.json"

async function main() {
	const config = networkConfig[80001]
	const [owner] = await ethers.getSigners()

	const Game = await ethers.getContractFactory("Game");
	
	const ChainlinkRandomizer = await ethers.getContractFactory("ChainlinkRandomizer")
	const randomizer = await ChainlinkRandomizer.deploy(
		config.subscriptionId,
        config.vrfCoordinator,
        config.keyHash,
	);

	const contract = await Game.deploy(randomizer.address);
	await contract.deployed();
	console.log(`✅ Deployed contract ${contract.address}`);
    await contract.deployTransaction.wait(VERIFICATION_BLOCK_CONFIRMATIONS)
	await run("verify:verify", {
		address: randomizer.address,
		constructorArguments: [config.subscriptionId, config.vrfCoordinator, config.keyHash],
	})

	await run("verify:verify", {
		address: contract.address,
		constructorArguments: [randomizer.address],
	})
	console.log(`✅ Contract verified`);
	// Add consumer
	const coordinator = new ethers.Contract(
		config.vrfCoordinator,
		VRF_COORDINATOR_ABI,
		owner
	)
	await coordinator.addConsumer(config.subscriptionId, randomizer.address)
	console.log(`✅ Added consumer`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
